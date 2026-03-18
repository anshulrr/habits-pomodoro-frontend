// create a context
// Put some state in the context
// Share the created context with other components

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, useContext } from "react";

import { db } from "services/db";
import { getItemsFromCache } from "./dbService";
import moment from "moment";

const DataContext = createContext();
export const useData = () => useContext(DataContext)

export default function DataProvider({ children }) {

    // TODO: don't initialize anything until login data is loaded
    const ALL_PAGESIZE = 1000;
    const projectsMap = useLiveQuery(async () => {
        const cachedProjects = await getItemsFromCache('projects', 1, ALL_PAGESIZE)
        console.log({ cachedProjects })
        return new Map(cachedProjects.map(item => [item.id, item]));
    }, []);

    const tagsMap = useLiveQuery(async () => {
        const cachedTags = await getItemsFromCache('tags', 1, ALL_PAGESIZE);
        console.log({ cachedTags })
        return new Map(cachedTags.map(item => [item.id, item]));
    }, []);

    const categoriesMap = useLiveQuery(async () => {
        const cachedCategories = await getItemsFromCache('categories', 1, ALL_PAGESIZE)
        console.log({ cachedCategories })
        return new Map(cachedCategories.map(item => [item.id, item]));
    })

    const tasksMap = useLiveQuery(async () => {
        const cachedTasks = await db['tasks'].toArray();
        console.log({ cachedTasks })
        return new Map(cachedTasks.map(item => [item.id, item]));
    }, []);

    const todaysPomodoros = useLiveQuery(async () => {
        let startDate = moment().startOf('day').toISOString();
        let endDate = moment().toISOString();
        return await db['pomodoros']
            .where('endTime')
            .between(startDate, endDate, false, true)
            .toArray();
    }, []);

    const valuesToBeShared = { projectsMap, tagsMap, categoriesMap, tasksMap, todaysPomodoros }

    // to prevent rendering the page before data is loaded from cache db, which causes some components to throw error as they rely on data.
    if (!tagsMap || !projectsMap || !categoriesMap || !tasksMap || !todaysPomodoros)
        return (
            <div className="loader-container my-1">
                <div className="loader"></div>
            </div >
        )

    return (
        <DataContext.Provider value={valuesToBeShared}>
            {children}
        </DataContext.Provider>
    )
}