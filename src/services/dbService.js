import { db } from 'services/db'

export async function addItemToCache(entity, item, prevCount) {
    try {
        // Add the new item to db!
        await db[entity].add(item)
        if (!!prevCount) {
            await db.metadata.put({ id: entity + 'Count', value: prevCount + 1 });
        }
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
    console.log("Back online! Syncing dirty items...");
    const dirtyItems = await db[entity].where('_dirty').equals(1).toArray();
    console.log('dirtyItemsCount', dirtyItems.length)
    for (const item of dirtyItems) {
        console.log("Syncing item", item);
        try {
            if (item.id !== -1) {
                await updateApi(item.id, item)
                // await putItemToCache({ ...item, _dirty: 0 })
                await db[entity].update(item.publicId, { _dirty: 0 });
            } else {
                const response = await createApi(item)
                // Update the item with the correct id from the backend and clear the dirty flag
                await db[entity].update(item.publicId, { id: response.data.id, _dirty: 0 });
            }

            // Success! Clear the flag locally
            await db[entity].update(item.publicId, { _dirty: 0 });
        } catch (e) {
            console.error(`Could not sync ${entity} `, item.id, e);
        }
    }
}



// TODO: check why async await is not necessary here
export async function getItemsFromCache(entity, currentPage, pageSize) {
    // console.debug('load data from cache');
    try {
        // Add the new category to db!
        return await db[entity]
            .orderBy(entity === 'categories' ? 'level' : 'priority')
            .offset((currentPage - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    } catch (error) {
        console.error(`Failed to get ${entity} : ${error}`)
    }
}

// TODO: check why async await is necessary here
export async function getItemsCountFromCache(entity) {
    try {
        const meta = await db.metadata.get(entity + 'Count')
        console.log({ meta })
        return meta ? meta.value : -1;
    } catch (error) {
        console.error(`Cache: Failed to get ${entity}  count: ${error}`)
    }
}

export async function putItemsCountToCache(entity, count) {
    try {
        db.metadata.put({ id: entity + 'Count', value: count });
    } catch (error) {
        console.error(`Cache: Failed to put ${entity} count: ${error}`)
    }
}

export async function bulkPutItemsToCache(entity, categories) {
    try {
        // Add the categories to db!
        await db[entity].bulkPut(categories)
    } catch (error) {
        console.error(`Cache: Failed to add ${categories}: ${error}`)
    }
}


export async function getItemFromCache(entity, id) {
    try {
        return await db[entity].get({ id: id });
    } catch (error) {
        console.error(`Failed to get ${entity}: ${error}`)
    }
}
