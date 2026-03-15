import moment from 'moment';
import Dexie from 'dexie';

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
    updateTaskApi,
    createTaskApi,
    getSyncAllTasksCountApi,
    retrieveSyncAllTasksApi,
    getTasksCommentsCountApi
} from './api/TaskApiService';
import {
    createPastPomodoroApi,
    getPomodorosApi,
    updatePomodoroApi
} from './api/PomodoroApiService';
import {
    createTagApi,
    getTagsCountApi,
    getTasksTagsApi,
    retrieveAllTagsApi,
    updateTagApi
} from './api/TagApiService';
import {
    createCommentApi,
    getCommentsCountApi,
    retrieveSyncAllCommentsApi,
    updateCommentApi
} from './api/CommentApiService';

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
        createApi: createPastPomodoroApi,
        updateApi: updatePomodoroApi,
        retrieveAllApi: getPomodorosApi,
        retrieveSyncAllApi: getPomodorosApi,
        getCountApi: () => {
            console.info('getCountApi is not supported for pomodoros')
            return { data: -1 };
        }
    },
    'tags': {
        createApi: createTagApi,
        updateApi: updateTagApi,
        retrieveAllApi: retrieveAllTagsApi,
        retrieveSyncAllApi: retrieveAllTagsApi,
        getCountApi: getTagsCountApi
    },
    'comments': {
        createApi: createCommentApi,
        updateApi: updateCommentApi,
        retrieveAllApi: retrieveSyncAllCommentsApi,
        retrieveSyncAllApi: retrieveSyncAllCommentsApi,
        getCountApi: getCommentsCountApi
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
        endDate: new Date().toISOString()
    }));
    promises.push(initEntityCache('tags', { limit: 10000, offset: 0 }));
    promises.push(initEntityCache('comments', { limit: 10000, offset: 0 }, { filterBy: 'user' }));

    try {
        // Initialize cache for all entities in parallel, to improve performance
        await Promise.all(promises)
        // Set a flag in metadata to indicate cache has been initialized, so that we don't need to initialize it again on page refresh
        await db.metadata.put({ id: 'cache-init', value: 1 });
        console.info("Cache database initialization complete!");
        // Init view related data in background, no need to wait for it to complete, to improve performance of first load
        await initView();
        console.info("View data initialization complete!");
    } catch (error) {
        console.error("One of the init chache tasks failed: please relogin", error);
    }
}

/*
1. Get count of items from backend and put to cache, so that we can show the count in UI without fetching all items
2. Get all items from backend and put to cache, so that we can show the items in UI without fetching from backend again
*/
export async function initEntityCache(entity, requestData, requestCountData) {
    // console.debug({ entity, requestData, requestCountData })
    try {
        let itemsCount = (await apiMap[entity].getCountApi(requestCountData)).data;
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
        db.tags.clear(),
        db.comments.clear(),
        db.metadata.clear()
    ]);
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
        item.createdAt = new Date().toISOString();
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
    console.info(entity, 'dirtyItemsCount', dirtyItems.length)
    for (const item of dirtyItems) {
        // console.debug("Syncing item", item);
        try {
            if (!item.createdAt) {
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
                await apiMap[entity].createApi(item);
                // Update the item with the correct id from the backend and clear the dirty flag
                await db[entity].update(item.id, { _dirty: 0, createdAt: undefined });
            }

            // Success! Clear the flag locally
            console.info(`Successfully synced ${entity}: ${item.id}, clearing flag...`);
        } catch (e) {
            console.error(`Could not sync ${entity}: ${item.id}`, e);
        }
    }
}

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
    console.info(`Syncing delta items of ${entity}...`);
    const lastSyncMeta = await db.metadata.get('last_sync_' + entity);
    const lastSyncTime = lastSyncMeta ? lastSyncMeta.value : '1970-01-01T00:00:00Z';

    try {
        // 1. Fetch only what changed since last time
        // TODO: decide limit
        const items = (await apiMap[entity].retrieveSyncAllApi({ limit: 10000, offset: 0, lastSyncTime, ...requestData })).data;
        // console.debug('delta items', { items });

        // 2. Transaction: Save data and the NEW sync time together
        // TODO: check if new items are synced or not with this way
        await db.transaction('rw', db[entity], db.metadata, async () => {
            // Instead of full update, only update recieved keys, so that old extra keys (eg. _dirty, timeElapsed) are not removed
            for (const item of items) {
                // console.log({ item })
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
        console.error(`Cache: Failed to sync delta items of ${entity}: ${error}`)
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
        } else {
            orderBy = 'priority';
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

// COMMENTS
// for dropdowns
export async function getFilteredItemsFromCache(entity, filterBy, { limit, offset }) {
    // console.debug(`load filtered ${entity} from cache`);
    try {
        // Add the new category to db!
        let sortBy = 'priority';
        if (entity === 'categories') {
            sortBy = 'level';
        }
        return await db[entity]
            .where(filterBy)
            .sortBy(sortBy)
            .then(tasks => tasks.slice(offset, offset + limit))
    } catch (error) {
        console.error(`Failed to get ${entity}: ${error}`)
    }
}

export async function getCommentsCountFromCache({ filterBy, filterById, filterWithReviseDate, searchString }) {
    // console.debug('load comments count from cache', { filterBy, filterById, filterWithReviseDate, searchString });
    try {
        let query = await createCommentsFilterQuery({ filterBy, filterById, filterWithReviseDate, searchString });
        if (filterWithReviseDate) {
            query = query
                .filter(comment => !!comment.reviseDate)
        }
        return query
            .count()
    } catch (error) {
        console.error(`Failed to get comments count: ${error}`)
    }
}

export async function getCommentsFromCache({ filterBy, filterById, filterWithReviseDate, searchString, limit, offset }) {
    // console.debug('load comments from cache', { filterBy, filterById, filterWithReviseDate, searchString, limit, offset });
    try {
        let query = await createCommentsFilterQuery({ filterBy, filterById, filterWithReviseDate, searchString });
        if (filterWithReviseDate) {
            query = query
                .filter(comment => !!comment.reviseDate)
        }
        return query
            .offset(offset)
            .limit(limit)
            .toArray()
    } catch (error) {
        console.error(`Failed to get comments: ${error}`)
    }
}

async function createCommentsFilterQuery({ filterBy, filterById, filterWithReviseDate, searchString }) {
    let query = db['comments'];
    if (filterBy === 'task') {
        query = query.where('[taskId+createdAt]')
    } else if (filterBy === 'project') {
        query = query.where('[projectId+createdAt]')
    } else if (filterBy === 'category') {
        query = query.where('[categoryId+createdAt]')
    } else if (filterBy === 'user') {
        query = query.orderBy('createdAt')
            .reverse();
        if (searchString) {
            const regex = new RegExp(searchString, 'i');
            // TODO: improve query performance
            query = query
                .filter(comment => regex.test(comment.description))
        }
        return query;
    }
    query = query
        .between([filterById, Dexie.minKey], [filterById, Dexie.maxKey])
        .reverse()

    return query;
}

// POMODOROS
export async function getPomodorosFromCache({ startDate, endDate, includeCategories }) {
    console.debug('load pomodoros from cache', { startDate, endDate, });
    try {
        let query = db['pomodoros'];
        query = query.where('endTime')
            .between(startDate, endDate, true, true)
            .reverse();
        // TODO: handle include categories
        return await query
            .filter(pomodoro => pomodoro.status === 'past' || pomodoro.status === 'completed')
            .toArray();
    } catch (error) {
        console.error(`Failed to get pomodoros: ${error}`)
    }
}

// TASKS
export async function getTasksCountFromCache({ projectId, tagId, startDate, endDate, searchString, status }) {
    // console.debug('load tasks count from cache', { projectId, tagId, startDate, endDate, searchString, status });
    try {
        return (await createTasksFilterQuery({ projectId, tagId, startDate, endDate, searchString }))
            .and(task => task.status === status)
            .count()
    } catch (error) {
        console.error(`Failed to get tasks count: ${error}`)
    }
}

export async function getTasksFromCache({ projectId, tagId, startDate, endDate, searchString, status, limit, offset }) {
    // console.debug('load tasks from cache', { projectId, tagId, startDate, endDate, searchString, status, limit, offset });
    try {
        return (await createTasksFilterQuery({ projectId, tagId, startDate, endDate, searchString }))
            .and(task => task.status === status)
            .sortBy('priority')
            .then(tasks => tasks.slice(offset, offset + limit))
    } catch (error) {
        console.error(`Failed to get tasks: ${error}`)
    }
}

async function createTasksFilterQuery({ projectId, tagId, startDate, endDate, searchString }) {
    let query = db['tasks'];
    if (projectId || projectId === 0) { // check 0 for new project
        query = query.where({ projectId })
    } else if (tagId) {
        const taskIds = await db['tasks_tags']
            .where({ tagId })
            .toArray()
            .then(row => row.map(rel => rel.taskId));
        query = query.where('id').anyOf(taskIds);
    } else if (startDate && endDate) {
        query = query.where('dueDate')
            .between(startDate, endDate)
    } else if (searchString) {
        // TODO improve query 
        /*
        query = query.where('description')
            .startsWithIgnoreCase(searchString)
        */
        const regex = new RegExp(searchString, 'i');
        // TODO: improve query performance
        query = query
            .filter(task => regex.test(task.description))
    }
    return query;
}

export async function getTagTasksCountFromCache({ tagId, status }) {
    console.debug('load tag tasks count from cache', { tagId, status });
    try {
        const taskIds = await db['tasks_tags']
            .where({ tagId })
            .toArray()
            .then(row => row.map(rel => rel.taskId));
        return await db['tasks']
            .where('id')
            .anyOf(taskIds)
            .and(task => task.status === status)
            .count();
    } catch (error) {
        console.error(`Failed to get tag tasks count: ${error}`)
    }
}

export async function getTagTasksFromCache({ tagId, status, limit, offset }) {
    console.debug('load tag tasks from cache', { tagId, status, limit, offset });
    try {
        const taskIds = await db['tasks_tags']
            .where({ tagId })
            .toArray()
            .then(row => row.map(rel => rel.taskId));
        return await db['tasks']
            .where('id')
            .anyOf(taskIds)
            .and(task => task.status === status)
            .sortBy('priority')
            .then(tasks => tasks.slice(offset, offset + limit));
    } catch (error) {
        console.error(`Failed to get tag tasks: ${error}`)
    }
}

// COMMON
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
        console.info(`Cache: Successfully added ${items.length} items to cache for ${entity}`)
    } catch (error) {
        console.error(`Cache: Failed to add ${entity}: ${error}`)
    }
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

// VIEW
async function initView() {
    await initTaskView();
    await initProjectView();
}

// TASKS: view
async function initTaskView() {
    try {
        const tasks = await db.tasks.toArray();

        const taskMap = new Map();
        // storage for task data today's time elapsed, total time elapsed and tags
        tasks.forEach(task => taskMap.set(task.id, {
            id: task.id,
            todaysTimeElapsed: 0,
            totalTimeElapsed: 0,
            tags: []
        }));
        const taskIds = tasks.map(task => task.id);

        // set time elapsed for today and total time elapsed for all tasks
        let startDate = moment().startOf('day').toISOString();
        let endDate = moment().toISOString();
        await setTasksTodaysTimeElapsed({ taskMap, taskIds, startDate, endDate });

        startDate = moment().add(-10, 'y').toISOString();
        await setTasksTotalTimeElapsed({ taskMap, taskIds, startDate, endDate });

        // set tags for all tasks
        await setTasksTags({ taskIds });

        // set comments count for all tasks
        await setTasksCommentsCount({ taskIds });

    } catch (error) {
        console.error(`Cache VIEW: Failed to initialize view data: ${error}`)
    }
}

// Tasks Cache initView methods
async function setTasksTodaysTimeElapsed({ taskMap, taskIds, startDate, endDate }) {
    try {
        const pomodoros = await db['pomodoros']
            .where('taskId').anyOf(taskIds)
            .and(pomodoro => new Date(pomodoro.startTime) >= new Date(startDate) && new Date(pomodoro.endTime) <= new Date(endDate))
            .toArray();
        for (const pomodoro of pomodoros) {
            taskMap.get(pomodoro.taskId).todaysTimeElapsed += pomodoro.timeElapsed;
        }
        for (const taskId of taskIds) {
            // console.log({ taskId }, taskMap.get(taskId).todaysTimeElapsed);
            modifyItemInCache('tasks', taskId, { todaysTimeElapsed: taskMap.get(taskId).todaysTimeElapsed })
        }
        console.log(`Cache VIEW: Finished setting tasks time elapsed since ${startDate}`);
    } catch (error) {
        console.error(`Cache VIEW: Failed to set tasks time elapsed since ${startDate}: ${error}`)
    }
}

async function setTasksTotalTimeElapsed({ taskMap, taskIds, startDate, endDate }) {
    try {
        const pomodoros = await db['pomodoros'].toArray();
        for (const pomodoro of pomodoros) {
            taskMap.get(pomodoro.taskId).totalTimeElapsed += pomodoro.timeElapsed;
        }
        for (const taskId of taskIds) {
            // console.log({ taskId }, taskMap.get(taskId).totalTimeElapsed);
            modifyItemInCache('tasks', taskId, { totalTimeElapsed: taskMap.get(taskId).totalTimeElapsed })
        }
        console.log(`Cache VIEW: Finished setting tasks time elapsed since ${startDate}`);
    } catch (error) {
        console.error(`Cache VIEW: Failed to set tasks time elapsed since ${startDate}: ${error}`)
    }
}

async function setTasksTags({ taskIds }) {
    try {
        const response = await getTasksTagsApi(taskIds)
        console.log('Retrieved tasks tags from api:', { data: response.data });

        // store relationship in cache
        bulkPutItemsToCache('tasks_tags', response.data.map(item => ({ taskId: item[2], tagId: item[3] })));

        // store tags data in tasks in cache
        // using Map for easy access and update
        const map = new Map();
        for (let i = 0; i < response.data.length; i++) {
            const tagId = response.data[i][3];
            const taskId = response.data[i][2];
            if (!map.has(taskId)) {
                map.set(taskId, []);
            }
            map.get(taskId).push(tagId);
        }
        console.debug({ tasks_tags_map: map });
        // TODO: update in one query
        for (const taskId of map.keys()) {
            modifyItemInCache('tasks', taskId, { tags: map.get(taskId) })
        }
    } catch (error) {
        console.error(`Cache VIEW: Failed to set tasks tags: ${error}`)
    }
}

async function setTasksCommentsCount({ taskIds }) {
    try {
        const response = await getTasksCommentsCountApi(taskIds)
        console.log('Retrieved tasks comments count from api:', { data: response.data });
        // using Map for easy access and update
        for (let i = 0; i < response.data.length; i++) {
            modifyItemInCache('tasks', response.data[i][0], { commentsCount: parseInt(response.data[i][1]) })
        }
    } catch (error) {
        console.error(`Cache VIEW: Failed to set tasks comments count: ${error}`)
    }
}

// TAGS cache update methods for task mapping
export async function updateTasksTag(updatedTag) {
    try {
        const taskIds = await db.tasks_tags
            .where({ tagId: updatedTag.id })
            .toArray()
            .then(row => row.map(rel => rel.taskId));
        // NOTE: TODO: check why in backend tasks_tags are store multiple time (not unique combination)
        // console.debug({ taskIds }, taskIds.length);

        // TODO: check efficiency of this method
        await db.tasks
            .where('id')
            .anyOf(taskIds)
            .modify(
                task => {
                    task.tags = task.tags.map(tag => {
                        if (tag.id === updatedTag.id) {
                            return updatedTag;
                        }
                        return tag;
                    })
                }
            );
        // console.debug(`successfully updated ${taskIds.length} tasks with updated tag data with id: ${updatedTag.id}`);
    } catch (error) {
        console.error(`Cache: failed to udpate tasks tag: ${error}`);
    }
}

export async function updateTaskTags(taskId, tagIds) {
    try {
        // update tasks_tags table
        // console.debug(tagIds.map(tagId => { return { taskId, tagId } }));
        await db.tasks_tags
            .bulkPut(tagIds.map(tagId => { return { taskId, tagId } }));

        // update tags of the task
        await db.tasks
            .where({ id: taskId })
            .modify({
                tags: [...tagIds]
            })
        // console.debug([...tagsMap.values()].filter(tag => tagIds.includes(tag.id)))
    } catch (error) {
        console.error(`Cache: failed to udpate task tags: ${error}`);
    }
}

// PROJECTS
async function initProjectView() {
    // set time elapsed for today and total time elapsed for all tasks
    let startDate = moment().startOf('day').toISOString();
    let endDate0 = moment().toISOString();
    let endDate = moment().startOf('day').add(1, 'd').toISOString();
    // TODO: check issue with timezone
    console.debug({ startDate, endDate0, endDate })

    try {
        const pomodoros = await getPomodorosFromCache({ startDate, endDate });
        const map = new Map();
        console.debug({ pomodoros }, map)
        for (let i = 0; i < pomodoros.length; i++) {
            const pomodoro = pomodoros[i];
            const projectId = pomodoro.projectId;
            if (map.has(projectId)) {
                map.set(projectId, map.get(projectId) + pomodoro.timeElapsed);
            } else {
                map.set(projectId, pomodoro.timeElapsed);
            }
        }
        console.debug({ pomodoros }, map)
        // update cache for displaying today's projects time elapsed
        map.forEach((timeElapsed, projectId) => {
            modifyItemInCache('projects', projectId, { timeElapsed });
        });
        console.info(`Cache VIEW: Finished setting projects time elapsed since ${startDate}`);
    } catch (error) {
        console.error(`Cache VIEW: Failed to set projects time elapsed since ${startDate}: ${error}`)
    }
}