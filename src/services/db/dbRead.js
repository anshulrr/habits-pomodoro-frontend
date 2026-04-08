import Dexie from "dexie";
import { db } from "services/db";

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

// TODO: check why async await is not necessary here
/*
1. Get items from cache with pagination, so that we can show the items in UI without fetching from backend again
2. The items are ordered by priority
*/
export async function getItemsFromCache(entity, currentPage, pageSize) {
    // console.debug('load data from cache');
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

// READ COMMENTS
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

// READ POMODOROS
export async function getPomodorosFromCache({ startDate, endDate, includeCategories }) {
    // console.debug('load pomodoros from cache', { startDate, endDate, });
    try {
        let query = db['pomodoros'];
        query = query.where('endTime')
            .between(startDate, endDate, false, true)
            .reverse();
        // TODO: handle include categories
        return await query
            .filter(pomodoro => pomodoro.status === 'past' || pomodoro.status === 'completed')
            .toArray();
    } catch (error) {
        console.error(`Failed to get pomodoros: ${error}`)
    }
}

// READ TASKS
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
        query = query.where('tagIds')
            .equals(tagId)
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