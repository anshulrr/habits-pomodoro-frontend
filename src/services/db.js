import { Dexie } from "dexie"

export const db = new Dexie("myDatabase")

db.version(4).stores({
    categories: "publicId, id, name, level, _dirty",
    metadata: "id"
})