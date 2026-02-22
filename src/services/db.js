import { Dexie } from "dexie"

export const db = new Dexie("myDatabase")

db.version(3).stores({
    categories: "id, name, level",
    metadata: "id"
})