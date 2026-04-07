import { Dexie } from "dexie"

export const db = new Dexie("habits-pomodoro-database")

db.version(2).stores({
    /*
    1. _dirty field is used to mark entities that are created/updated/deleted while offline, to be synced when back online.
    2. updatedAt field is used for conflict resolution, 
        a. to keep the latest updated entity in case of conflicts,
        b. to be used by server when syncing data from multiple clients, and by client when syncing data from server.
    */
    categories: "id, name, level, updatedAt, _dirty",
    /*
    1. using composite index for sorting by categoryPriority and priority, 
        for displaying in the order of category and then project priority within the category. 
    */
    projects: "id, name, [categoryPriority+priority], projectCategoryId, updatedAt, _dirty",
    /*
    1. added multiple indexes for sorting and filtering by different fields.
    */
    tasks: "id, description, projectId, status, dueDate, priority, *tagIds, updatedAt, _dirty",

    pomodoros: "id, taskId, projectId, startTime, endTime, status, updatedAt, _dirty",

    tags: "id, name, priority, createdAt, updatedAt, _dirty",

    comments: "id, [categoryId+createdAt], [projectId+createdAt], [taskId+createdAt], reviseDate, createdAt, updatedAt, _dirty",

    tasks_tags: "++id, taskId, tagId",
    /*
    1. key value pairs for storing metadata related to syncing, such as:
        entityCount,
        lastSyncEntity, 
        cache-init
    */
    metadata: "id"
})