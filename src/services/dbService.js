import { db } from 'services/db'

import {
    createProjectCategoryApi,
    getProjectCategoriesCountApi,
    retrieveAllProjectCategoriesApi,
    retrieveSyncProjectCategoriesApi,
    updateProjectCategoryApi
} from './api/ProjectCategoryApiService';
import {
    createProjectApi,
    updateProjectApi,
    retrieveAllProjectsApi,
    getProjectsCountApi
} from './api/ProjectApiService';
import {
    retrieveAllTasksApi,
    getTasksCountApi,
    updateTaskApi,
    createTaskApi,
    getSyncAllTasksCountApi,
    retrieveSyncAllTasksApi
} from './api/TaskApiService';
import {
    getPomodorosApi
} from './api/PomodoroApiService';

const apiMap = {
    'categories': {
        createApi: createProjectCategoryApi,
        updateApi: updateProjectCategoryApi,
        retrieveAllApi: retrieveAllProjectCategoriesApi,
        retrieveSyncAllApi: retrieveSyncProjectCategoriesApi,
        getCountApi: getProjectCategoriesCountApi
    },
    'projects': {
        createApi: createProjectApi,
        updateApi: updateProjectApi,
        retrieveAllApi: retrieveAllProjectsApi,
        retrieveSyncAllApi: retrieveAllProjectsApi,
        getCountApi: getProjectsCountApi
    },
    'tasks': {
        createApi: createTaskApi,
        updateApi: updateTaskApi,
        retrieveAllApi: retrieveSyncAllTasksApi,
        retrieveSyncAllApi: retrieveSyncAllTasksApi,
        getCountApi: getSyncAllTasksCountApi,
    },
    'pomodoros': {
        retrieveAllApi: getPomodorosApi,
        getCountApi: () => {
            console.info('getCountApi is not supported for pomodoros')
            return { data: -1 };
        }
    }
};

// Initialize cache database on login
// TODO: only sync first few items for first time load, and then sync the rest in background, to improve performance of first load
export async function initCacheDb() {
    console.info("Initializing cache database...");
    // const entities = ['categories', 'projects'];
    const promises = [];
    promises.push(initEntityCache('categories'));
    promises.push(initEntityCache('projects', { limit: 10000, offset: 0 }));
    promises.push(initEntityCache('tasks', { limit: 10000, offset: 0 }));
    promises.push(initEntityCache('pomodoros', {
        startDate: '1970-01-01T00:00:00Z',
        endDate: new Date().toISOString(),
        includeCategories: []
    }));

    try {
        // Initialize cache for all entities in parallel, to improve performance
        await Promise.all(promises)
        // Set a flag in metadata to indicate cache has been initialized, so that we don't need to initialize it again on page refresh
        await db.metadata.put({ id: 'cache-init', value: 1 });
        console.info("Cache database initialization complete!");
    } catch (error) {
        console.error("One of the init chache tasks failed: please relogin", error);
    }
}

/*
1. Get count of items from backend and put to cache, so that we can show the count in UI without fetching all items
2. Get all items from backend and put to cache, so that we can show the items in UI without fetching from backend again
*/
async function initEntityCache(entity, requestData) {
    try {
        let itemsCount = (await apiMap[entity].getCountApi()).data;
        await putItemsCountToCache(entity, itemsCount);

        console.info(`Initializing cache for ${entity} with ${itemsCount} items...`);
        if (entity === 'categories') {
            const items = (await apiMap[entity].retrieveAllApi(itemsCount, 0)).data;
            await bulkPutItemsToCache(entity, items);
        } else {
            const items = (await apiMap[entity].retrieveAllApi(requestData)).data;
            await bulkPutItemsToCache(entity, items);
        }
    } catch (error) {
        console.error(`Cache: Failed to initialize cache of ${entity}: ${error}`)
    }
}

// after logout, clear cache db to prevent data leak between accounts
export function clearCacheDb() {
    return Promise.all([
        db.categories.clear(),
        db.projects.clear(),
        db.tasks.clear(),
        db.pomodoros.clear(),
        db.metadata.clear()
    ]);
}

/*
1. Add new item to cache with _dirty flag, so that it can be synced to backend later
2. Update count of items in cache, so that we can show the updated count in UI without fetching from backend again
*/
export async function addItemToCache(entity, item) {
    try {
        // Add the new item to db!
        item._dirty = 1;
        item.updatedAt = new Date().toISOString();
        await db[entity].add(item)
        const prevCount = await getItemsCountFromCache(entity);
        await db.metadata.put({ id: 'count_' + entity, value: prevCount + 1 });
        if (navigator.onLine) {
            console.info(`Online! Syncing added dirty ${entity}...`);
            syncDirtyItems(entity); // Fire and forget in background
        }
    } catch (error) {
        console.error(`Cache: Failed to add ${item.id}: ${error}`)
    }
}

/*
1. Update item in cache with _dirty flag, so that it can be synced to backend later
*/
export async function putItemToCache(entity, item) {
    // console.debug({ item })
    try {
        // Update item to db!
        item._dirty = 1;
        item.updatedAt = new Date().toISOString();
        await db[entity].put(item);
        if (navigator.onLine) {
            console.info(`Online! Syncing updated dirty ${entity}...`);
            syncDirtyItems(entity); // Fire and forget in background
        }
    } catch (error) {
        console.error(`Cache: Failed to update ${item.id}: ${error}`)
    }
}

/*
1. Sync all entities with dirty items parallelly, to improve performance
*/
export function syncDirtyEntities() {
    for (const entity of ['categories', 'projects', 'tasks']) {
        syncDirtyItems(entity).then(() => {
            console.info(`Successfully synced dirty items for ${entity}`);
        }).catch(error => {
            console.error(`Cache: Failed to sync dirty items for ${entity}: ${error}`)
        });
    }
}

/*
1. Get all dirty items from cache, and sync them to backend one by one
2. After successful sync, clear the _dirty flag of the item in cache, so that it won't be synced again
3. If the item is new (id === -1), create it in backend and update the id in cache, so that it can be synced correctly next time
4. If there is a conflict (response status 409), it means the item has been updated in backend by another device, so we will skip syncing this item and it will be corrected on next sync (when user edit it again or come online again), to prevent data loss. TODO: we can also trigger a syncItems immediately to get the latest version from backend, to improve user experience.
*/
export async function syncDirtyItems(entity) {
    const dirtyItems = await db[entity].where('_dirty').equals(1).toArray();
    console.info('dirtyItemsCount', dirtyItems.length)
    for (const item of dirtyItems) {
        // console.debug("Syncing item", item);
        try {
            if (item.id !== -1 && item.id !== 0) {
                const response = await apiMap[entity].updateApi(item.id, item);
                if (response.status === 409) {
                    console.info(`conflict detected for ${entity}: ${item.id}, will be corrected on next sync`);
                    // TODO: trigger syncItems
                    return;
                }
                // Atomic Check: Only clear _dirty if the timestamp matches what we just sent 
                // (prevents clearing if user edited it again mid-sync)
                await db[entity]
                    .where({ id: item.id })
                    .and(dbItem => dbItem.updatedAt === item.updatedAt)
                    .modify({ _dirty: 0 });
            } else {
                const response = await apiMap[entity].createApi(item);
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

/*
1. Sync all entities with delta items parallelly, to improve performance
*/
export function syncEntitiesDelta() {
    for (const entity of ['categories', 'projects', 'tasks']) {
        syncDeltaItems(entity).then(() => {
            console.info(`Successfully synced delta items for ${entity}`);
        }).catch(error => {
            console.error(`Cache: Failed to sync delta items for ${entity}: ${error}`)
        });
    }
}

/*
1. Get items that are updated since last sync time from backend, 
2. and update them in cache, 
3. Update the last sync time in cache, so that we can fetch delta items later
*/
export async function syncDeltaItems(entity) {
    console.info(`Syncing delta items of ${entity}...`);
    const lastSyncMeta = await db.metadata.get('last_sync_' + entity);
    const lastSyncTime = lastSyncMeta ? lastSyncMeta.value : '1970-01-01T00:00:00Z';

    try {
        // 1. Fetch only what changed since last time
        // TODO: decide limit
        const items = (await apiMap[entity].retrieveSyncAllApi({ limit: 10000, offset: 0, lastSyncTime })).data;

        // 2. Transaction: Save data and the NEW sync time together
        await db.transaction('rw', db[entity], db.metadata, async () => {
            // Instead of full update, only update recieved keys, so that old extra keys (eg. _dirty, timeElapsed) are not removed
            for (const item of items) {
                // Atomic Check: Only update if the item is not dirty locally (prevents overwriting unsynced local changes)
                // Or if the item is newer than what we have locally (handles updates from other devices)
                // otherwise local changes will be updated to server on next dirty sync, and we will get the latest version then
                await db[entity]
                    .where({ id: item.id })
                    .and(dbItem => dbItem._dirty !== 1 || new Date(dbItem.updatedAt) < new Date(item.updatedAt))
                    .modify(item);
            }
            // TODO: check if server time is better to use here instead of client time
            await db.metadata.put({ id: 'last_sync_' + entity, value: new Date().toISOString() });
        });
        console.info(`Successfully synced ${items.length} delta items of ${entity}`);
    } catch (error) {
        console.error(`Cache: Failed to sync items: ${error}`)
    }
}

// TODO: check why async await is not necessary here
/*
1. Get items from cache with pagination, so that we can show the items in UI without fetching from backend again
2. The items are ordered by priority
*/
export async function getItemsFromCache(entity, currentPage, pageSize) {
    console.debug('load data from cache');
    try {
        // Add the new category to db!
        let orderBy = 'id';
        if (entity === 'categories') {
            orderBy = 'level';
        } else if (entity === 'projects') {
            orderBy = '[categoryPriority+priority]';
        }
        return await db[entity]
            .orderBy(orderBy)
            .offset((currentPage - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    } catch (error) {
        console.error(`Failed to get categories: ${error}`)
    }
}

export async function getProjectTasksCountFromCache({ projectId, status }) {
    console.debug('load tasks count from cache', { projectId, status });
    try {
        // Add the new category to db!
        return await db['tasks']
            .where({ projectId })
            .and(task => task.status === status)
            .count();
    } catch (error) {
        console.error(`Failed to get tasks count: ${error}`)
    }
}

export async function getProjectTasksFromCache({ projectId, status, limit, offset }) {
    // console.debug('load tasks from cache', { projectId, status, limit, offset });
    try {
        // Add the new category to db!
        return await db['tasks']
            .where({ projectId })
            .and(task => task.status === status)
            .sortBy('priority')
            .then(tasks => tasks.slice(offset, offset + limit));
    } catch (error) {
        console.error(`Failed to get tasks: ${error}`)
    }
}

// TODO: check why async await is necessary here
/*
1. Get count of items from cache, so that we can show the count in UI without fetching from backend again
*/
export async function getItemsCountFromCache(entity) {
    try {
        const meta = await db.metadata.get('count_' + entity)
        return meta ? meta.value : -1;
    } catch (error) {
        console.error(`Cache: Failed to get categories count: ${error}`)
    }
}

/*
1. Update count of items in cache, so that we can show the updated count in UI without fetching from backend again
*/
export async function putItemsCountToCache(entity, count) {
    try {
        await db.metadata.put({ id: 'count_' + entity, value: count });
    } catch (error) {
        console.error(`Cache: Failed to put categories count: ${error}`)
    }
    console.info(`Cache: Successfully put ${entity} count to cache: ${count}`)
}

/*
1. Bulk add items to cache, used for first time load and sync delta
2. Update the last sync time for the entity, so that we can fetch delta items later
*/
export async function bulkPutItemsToCache(entity, items) {
    try {
        await db[entity].bulkPut(items)
        const now = new Date().toISOString();
        await db.metadata.put({ id: 'last_sync_' + entity, value: now });
    } catch (error) {
        console.error(`Cache: Failed to add ${entity}: ${error}`)
    }
    console.info(`Cache: Successfully added ${items.length} items to cache for ${entity}`)
}

/*
1. add or update key value pairs of an item in cache, 
2. used for adding data to be shown in the UI but not needed to be synced to backend
*/
export async function modifyItemInCache(entity, id, dataObject) {
    // console.debug({ entity, id }, dataObject)
    try {
        await db[entity]
            .where({ id })
            .modify(dataObject);
    } catch (error) {
        console.error(`Cache: Failed to update ${entity}: ${error}`, id)
    }
}

/*
1. Get an item from cache by id, used for showing item details in UI in new page where list is not available
*/
export async function getItemFromCache(entity, id) {
    // console.debug('loading data from cache');
    // console.debug({ entity, id })
    try {
        return await db[entity].get({ id });
    } catch (error) {
        console.error(`Failed to get ${entity} with id: ${id}: ${error}`)
    }
}