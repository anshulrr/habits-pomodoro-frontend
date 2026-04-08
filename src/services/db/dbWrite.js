import { db } from "services/db/db";
import { syncDirtyItems } from "./dbSync";
import { getItemsCountFromCache } from "./dbRead";

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
1. Add new item to cache with _dirty flag, so that it can be synced to backend later
2. Update count of items in cache, so that we can show the updated count in UI without fetching from backend again
*/
export async function addItemToCache(entity, item) {
    try {
        // new item default values
        item.id = window.crypto.randomUUID();
        item._dirty = 1;
        item.isCreated = true;
        item.createdAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();

        await db[entity].add(item)
        const prevCount = await getItemsCountFromCache(entity);
        await db.metadata.put({ id: 'count_' + entity, value: prevCount + 1 });
        if (navigator.onLine) {
            // console.info(`Online! Syncing added dirty ${entity}...`);
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
            // console.info(`Online! Syncing updated dirty ${entity}...`);
            syncDirtyItems(entity); // Fire and forget in background
        }
    } catch (error) {
        console.error(`Cache: Failed to update ${item.id}: ${error}`)
    }
}

// TODO: use delta sync
export async function addServerItemToCache(entity, item) {
    // console.debug({ item })
    try {
        // Add item to cache
        item._dirty = 0;
        await db[entity].put(item)
    } catch (error) {
        console.error(`Cache: Failed to update server ${entity} ${item.id}: ${error}`)
    }
}

export async function putServerItemToCache(entity, item) {
    // console.debug({ item })
    try {
        // Update item to cache
        await db[entity]
            .where({ id: item.id })
            .modify(item);
    } catch (error) {
        console.error(`Cache: Failed to update server ${entity} ${item.id}: ${error}`)
    }
}