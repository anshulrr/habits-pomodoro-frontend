import { Dexie } from "dexie"

export const db = new Dexie("myDatabase")

db.version(5).stores({
    categories: "publicId, id, name, level, _dirty",
    projects: "publicId, id, name, priority, _dirty",
    metadata: "id"
})