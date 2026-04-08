import { db } from 'services/db/db'
import { apiMap } from "./dbConfig";
import {
    getTasksCommentsCountApi,
} from '../api/TaskApiService';
import {
    getTasksTagsApi,
} from '../api/TagApiService';

// **** INIT ****
// Initialize cache database on login
// TODO: only sync first few items for first time load, and then sync the rest in background, to improve performance of first load
export async function initCacheDb() {
    // console.info("Initializing cache database...");
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
        // console.info("Cache database initialization complete!", moment().toISOString());
        // Init view related data in background, no need to wait for it to complete, to improve performance of first load
        await initView();
        // console.info("View data initialization complete!", moment().toISOString());
        await db.metadata.put({ id: 'cache-init', value: 1 });
    } catch (error) {
        console.error("One of the init chache tasks failed: please relogin", error);
    }
}

/*
1. Get count of items from backend and put to cache, so that we can show the count in UI without fetching all items
2. Get all items from backend and put to cache, so that we can show the items in UI without fetching from backend again
*/
async function initEntityCache(entity, requestData, requestCountData) {
    // console.debug({ entity, requestData, requestCountData })
    try {
        let itemsCount = (await apiMap[entity].getCountApi(requestCountData)).data;
        await putItemsCountToCache(entity, itemsCount);

        // console.info(`Initializing cache for ${entity} with ${itemsCount} items...`);
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


// **** INIT CACHE ****
/*
1. Update count of items in cache, so that we can show the updated count in UI without fetching from backend again
*/
async function putItemsCountToCache(entity, count) {
    try {
        await db.metadata.put({ id: 'count_' + entity, value: count });
    } catch (error) {
        console.error(`Cache: Failed to put categories count: ${error}`)
    }
    // console.info(`Cache: Successfully put ${entity} count to cache: ${count}`)
}

/*
1. Bulk add items to cache, used for first time load and sync delta
2. Update the last sync time for the entity, so that we can fetch delta items later
*/
async function bulkPutItemsToCache(entity, items) {
    try {
        await db[entity].bulkPut(items)
        const now = new Date().toISOString();
        await db.metadata.put({ id: 'last_sync_' + entity, value: now });
        // console.info(`Cache: Successfully added ${items.length} items to cache for ${entity}`)
    } catch (error) {
        console.error(`Cache: Failed to add ${entity}: ${error}`)
    }
}

// **** INIT CACHE: VIEW DATA ****
async function initView() {
    await initTaskView();
}

async function initTaskView() {
    try {
        const tasks = await db.tasks.toArray();

        const taskMap = new Map();
        // storage for task data today's time elapsed, total time elapsed and tags
        tasks.forEach(task => taskMap.set(task.id, {
            id: task.id,
            tags: []
        }));
        const taskIds = tasks.map(task => task.id);

        // set tags for all tasks
        await setTasksTags({ taskIds });

        // set comments count for all tasks
        await setTasksCommentsCount({ taskIds });

    } catch (error) {
        console.error(`Cache VIEW: Failed to initialize view data: ${error}`)
    }
}

async function setTasksTags({ taskIds }) {
    try {
        const response = await getTasksTagsApi(taskIds)
        // console.debug('Retrieved tasks tags from api:', { data: response.data });

        // store tags data in tasks cache
        // using Map for easy access and update
        const tasksTagsMap = new Map();
        for (let i = 0; i < response.data.length; i++) {
            const tagId = response.data[i][3];
            const taskId = response.data[i][2];
            if (!tasksTagsMap.has(taskId)) {
                tasksTagsMap.set(taskId, []);
            }
            tasksTagsMap.get(taskId).push(tagId);
        }
        // console.debug({ tasks_tags_map: tasksTagsMap });
        // update cache
        const bulkData = taskIds.map(taskId => ({ key: taskId, changes: { tagIds: tasksTagsMap.get(taskId) } }));
        db['tasks'].bulkUpdate(bulkData);
    } catch (error) {
        console.error(`Cache VIEW: Failed to set tasks tags: ${error}`)
    }
}

async function setTasksCommentsCount({ taskIds }) {
    try {
        const response = await getTasksCommentsCountApi(taskIds)
        // console.debug('Retrieved tasks comments count from api:', { data: response.data });
        // update cache
        const bulkData = response.data.map(([taskId, commentsCount]) => ({ key: taskId, changes: { commentsCount: parseInt(commentsCount) } }));
        db['tasks'].bulkUpdate(bulkData);
    } catch (error) {
        console.error(`Cache VIEW: Failed to set tasks comments count: ${error}`)
    }
}