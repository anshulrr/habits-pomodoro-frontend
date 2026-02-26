import { db } from 'services/db'

import { getProjectCategoriesCountApi, retrieveAllProjectCategoriesApi } from './api/ProjectCategoryApiService';

export async function initCacheDb() {
    console.info("Initializing cache database...");
    try {
        const categoriesCount = (await getProjectCategoriesCountApi()).data;
        putItemsCountToCache('categories', categoriesCount);

        const categories = (await retrieveAllProjectCategoriesApi(categoriesCount, 0)).data;
        bulkPutItemsToCache('categories', categories);
    } catch (error) {
        console.error(`Cache: Failed to initialize cache: ${error}`)
    }
}

export async function addItemToCache(entity, item) {
    try {
        // Add the new item to db!
        await db[entity].add(item)
        const prevCount = await getItemsCountFromCache(entity);
        await db.metadata.put({ id: 'count_' + entity, value: prevCount + 1 });
    } catch (error) {
        console.error(`Cache: Failed to add ${item.id}: ${error}`)
    }
}

export async function putItemToCache(entity, item) {
    console.log({ item })
    try {
        // Update item to db!
        await db[entity].put(item)
    } catch (error) {
        console.error(`Cache: Failed to update ${item.id}: ${error}`)
    }
}


export async function syncDirtyItems(entity, createApi, updateApi) {
    const dirtyItems = await db[entity].where('_dirty').equals(1).toArray();
    console.debug('dirtyItemsCount', dirtyItems.length)
    for (const item of dirtyItems) {
        console.debug("Syncing item", item);
        try {
            if (item.id !== -1) {
                const response = await updateApi(item.id, item);
                if (response.status === 409) {
                    console.info(`conflict detected for ${entity}: ${item.id}, will be corrected on next sync`);
                    // TODO: trigger syncItems
                    return;
                }
                // await db[entity].update(item.publicId, { _dirty: 0 });
                // Atomic Check: Only clear _dirty if the timestamp matches what we just sent 
                // (prevents clearing if user edited it again mid-sync)
                await db[entity]
                    .where({ id: item.id })
                    .and(dbItem => dbItem.updatedAt === item.updatedAt)
                    .modify({ _dirty: 0 });
            } else {
                const response = await createApi(item)
                // Update the item with the correct id from the backend and clear the dirty flag
                await db[entity].update(item.publicId, { id: response.data.id, _dirty: 0 });
            }

            // Success! Clear the flag locally
            console.info(`Successfully synced ${entity}: ${item.id}, clearing flag...`);
            await db[entity].update(item.publicId, { _dirty: 0 });
        } catch (e) {
            console.error(`Could not sync ${entity}: ${item.id}`, e);
        }
    }
}

export async function syncItems(entity, retrieveAllApi) {
    console.log("Syncing items...");
    const lastSyncMeta = await db.metadata.get('last_sync_' + entity);
    const lastSyncTime = lastSyncMeta ? lastSyncMeta.value : '1970-01-01T00:00:00Z';

    try {
        // 1. Fetch only what changed since last time
        const items = (await retrieveAllApi({ limit: 1000, offset: 0, lastSyncTime })).data;

        // 2. Transaction: Save data and the NEW sync time together
        await db.transaction('rw', db[entity], db.metadata, async () => {
            if (items.length > 0) {
                await db[entity].bulkPut(items);
            }
            // TODO: check if server time is better to use here instead of client time
            await db.metadata.put({ id: 'last_sync_' + entity, value: new Date().toISOString() });
        });
        console.log(`Successfully synced ${items.length} items for ${entity}`);
    } catch (error) {
        console.error(`Cache: Failed to sync items: ${error}`)
    }
}

// TODO: check why async await is not necessary here
export async function getItemsFromCache(entity, currentPage, pageSize) {
    // console.debug('load data from cache');
    try {
        // Add the new category to db!
        return await db[entity]
            .orderBy('level')
            .offset((currentPage - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    } catch (error) {
        console.error(`Failed to get categories: ${error}`)
    }
}

// TODO: check why async await is necessary here
export async function getItemsCountFromCache(entity) {
    try {
        const meta = await db.metadata.get('count_' + entity)
        return meta ? meta.value : -1;
    } catch (error) {
        console.error(`Cache: Failed to get categories count: ${error}`)
    }
}

export async function putItemsCountToCache(entity, count) {
    try {
        await db.metadata.put({ id: 'count_' + entity, value: count });
    } catch (error) {
        console.error(`Cache: Failed to put categories count: ${error}`)
    }
}

export async function bulkPutItemsToCache(entity, categories) {
    try {
        // Add the categories to db!
        await db[entity].bulkPut(categories)
        const now = new Date().toISOString();
        await db.metadata.put({ id: 'last_sync_' + entity, value: now });
    } catch (error) {
        console.error(`Cache: Failed to add ${categories}: ${error}`)
    }
}
