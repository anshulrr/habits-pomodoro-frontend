import { Dexie } from "dexie"

export const db = new Dexie("myDatabase")

db.version(4).stores({
    categories: "publicId, id, name, level, updatedAt, _dirty",
    metadata: "id"
})