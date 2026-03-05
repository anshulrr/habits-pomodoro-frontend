import { Dexie } from "dexie"

export const db = new Dexie("myDatabase")

db.version(3).stores({
    /*
    1. _dirty field is used to mark entities that are created/updated/deleted while offline, to be synced when back online.
    2. updatedAt field is used for conflict resolution, 
        a. to keep the latest updated entity in case of conflicts,
        b. to be used by server when syncing data from multiple clients, and by client when syncing data from server.
    */
    categories: "publicId, id, name, level, updatedAt, _dirty",
    /*
    1. using composite index for sorting by categoryPriority and priority, 
        for displaying in the order of category and then project priority within the category. 
    */
    projects: "publicId, id, name, [categoryPriority+priority], updatedAt, _dirty",
    /*
    1. added multiple indexes for sorting and filtering by different fields.
    */
    tasks: "publicId, id, description, projectId, status, dueDate, priority, updatedAt, _dirty",

    pomodoros: "publicId, id, taskId, startTime, endTime, status, updatedAt, _dirty",

    tags: "publicId, id, name, priority, createdAt, updatedAt, _dirty",

    comments: "publicId, id, status, updatedAt, _dirty",

    tasks_tags: "++id, taskId, tagId",
    /*
    1. key value pairs for storing metadata related to syncing, such as:
        entityCount,
        lastSyncEntity, 
        cache-init
    */
    metadata: "id"
})