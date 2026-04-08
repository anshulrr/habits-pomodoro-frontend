import { db } from 'services/db';
import { apiMap } from './dbConfig';
import {
    retrieveTaskApi
} from '../api/TaskApiService';

// **** SYNC CACHE ****
/*
1. Sync all entities with dirty items parallelly, to improve performance
*/
export function syncDirtyEntities() {
    const entities = [
        'categories',
        'projects',
        'tasks',
        'tags',
        'comments',
        'pomodoros' // TODO: check if needed
    ]
    for (const entity of entities) {
        syncDirtyItems(entity).then(() => {
            // console.info(`Successfully synced dirty items for ${entity}`);
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
    // console.info(entity, 'dirtyItemsCount', dirtyItems.length)
    for (const item of dirtyItems) {
        // console.debug("Syncing item", item);
        try {
            if (!item.isCreated) {
                const response = await apiMap[entity].updateApi(item.id, item);
                if (response.status === 409) {
                    // console.info(`conflict detected for ${entity}: ${item.id}, will be corrected on next sync`);
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
                await apiMap[entity].createApi(item);
                // Update the item with the correct id from the backend and clear the dirty flag
                await db[entity].update(item.id, { _dirty: 0, isCreated: undefined });
            }

            // Success! Clear the flag locally
            // console.info(`Successfully synced ${entity}: ${item.id}, clearing flag...`);
        } catch (e) {
            console.error(`Could not sync ${entity}: ${item.id}`, e);
        }
    }
}

// **** SYNC SERVER ****
/*
1. Sync all entities with delta items parallelly, to improve performance
*/
export function syncEntitiesDelta() {
    syncDeltaItems('categories');
    syncDeltaItems('projects');
    syncDeltaItems('tasks');
    syncDeltaItems('pomodoros', {
        startDate: '1970-01-01T00:00:00Z',
        endDate: new Date().toISOString()
    });
    syncDeltaItems('tags');
    syncDeltaItems('comments', { filterBy: 'user' });
}

/*
1. Get items that are updated since last sync time from backend, 
2. and update them in cache, 
3. Update the last sync time in cache, so that we can fetch delta items later
*/
export async function syncDeltaItems(entity, requestData) {
    // console.info(`Syncing delta items of ${entity}...`);
    const lastSyncMeta = await db.metadata.get('last_sync_' + entity);
    const lastSyncTime = lastSyncMeta ? lastSyncMeta.value : '1970-01-01T00:00:00Z';

    try {
        // 1. Fetch only what changed since last time
        // TODO: decide limit
        const items = (await apiMap[entity].retrieveSyncAllApi({ limit: 10000, offset: 0, lastSyncTime, ...requestData })).data;
        // console.debug('delta items', { items });

        // 2. Transaction: Save data and the NEW sync time together
        await db.transaction('rw', db[entity], db.metadata, async () => {
            for (const item of items) {
                // 1. Fetch the existing local item
                const localItem = await db[entity].get(item.id);

                if (!localItem) {
                    // 2. NEW ITEM: If it doesn't exist locally, add it
                    await db[entity].add(item);
                } else {
                    // 3. EXISTING ITEM: Apply your atomic sync logic
                    // Atomic Check: Only update if the item is not dirty locally (prevents overwriting unsynced local changes)
                    // Or if the item is newer than what we have locally (handles updates from other devices)
                    // otherwise local changes will be updated to server on next dirty sync
                    const isNotDirty = localItem._dirty !== 1;
                    const isServerNewer = new Date(localItem.updatedAt) < new Date(item.updatedAt);

                    if (isNotDirty || isServerNewer) {
                        // Use update() to only change the keys received from server, 
                        // preserving local-only keys like '_dirty' or 'timeElapsed'
                        await db[entity].update(item.id, item);
                    }
                }
            }
            // TODO: check if server time is better to use here instead of client time
            await db.metadata.put({ id: 'last_sync_' + entity, value: new Date().toISOString() });
        });
        updateViewDataForDeltaItem(entity, items, lastSyncTime);

        // console.info(`Successfully synced ${items.length} delta items of ${entity}`);
    } catch (error) {
        console.error(`Cache: Failed to sync delta items of ${entity}: ${error}`)
    }
}

// TODO: this is a temp solution, decide if it is better to store the data needed for view in the db directly
/*
other approach:
    for new comment is added, update the comments count of the related task in cache
    for deleted comment, update the comments count of the related task in cache
    sync the updated task to backend 
*/
async function updateViewDataForDeltaItem(entity, serverItems, lastSyncTime) {
    try {
        for (const serverItem of serverItems) {
            // 1. Fetch the existing local item
            const localItem = await db[entity].get(serverItem.id);
            
            if (entity === 'comments') {
                console.debug({serverItem, localItem});
                if (new Date(localItem.createdAt) > new Date(lastSyncTime) && !!serverItem.taskId) {
                    // new comment, update the comments count of the related task
                    await db.tasks
                        .where({ id: serverItem.taskId })
                        .modify(task => {
                            console.log('Updating comments count for task in cache', task.id);
                            if (task.commentsCount) {
                                task.commentsCount += 1;
                            } else {
                                task.commentsCount = 1;
                            }
                        });
                }
            } else if (entity === 'tasks') {
                // temporary solution
                const serverTask = (await retrieveTaskApi({ id: serverItem.id })).data;
                // console.log(serverTask.tags.map(t => t.id))
                await db.tasks
                    .where({ id: serverTask.id })
                    .modify(task => {
                        task.tagIds = serverTask.tags.map(t => t.id);
                    });
            }
        }
    } catch (error) {
        console.error(`Cache: Failed to update view data for delta item of ${entity}: ${error}`)
    }   
}