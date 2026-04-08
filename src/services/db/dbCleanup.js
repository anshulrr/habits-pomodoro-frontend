import Dexie from "dexie";
import { db } from "services/db";

// after logout, clear cache db to prevent data leak between accounts
export function clearCacheDb() {
    checkAndDeleteOldDb()
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

async function checkAndDeleteOldDb() {
    // temp fix for primary key update
    const dbs = await window.indexedDB.databases();
    if (dbs.some(db => db.name === 'myDatabase')) {
        // console.debug('old database exists');
        Dexie.delete('myDatabase')
            .then(() => {
                // console.log("Old Database successfully deleted");
            }).catch((err) => {
                console.error("Could not delete database");
            })
    }
}
