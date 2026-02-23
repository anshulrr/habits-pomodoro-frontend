import { Dexie } from "dexie"

export const db = new Dexie("myDatabase")

db.version(2).stores({
    categories: "id, name, level, _dirty",
    metadata: "id"
})