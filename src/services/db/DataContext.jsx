// create a context
// Put some state in the context
// Share the created context with other components

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, useContext } from "react";

import { db } from "services/db/db";
import { getItemsFromCache } from "./dbService";
import moment from "moment";
import { toast } from "react-toastify";

const DataContext = createContext();
export const useData = () => useContext(DataContext)

export default function DataProvider({ children }) {

    // TODO: don't initialize anything until login data is loaded
    const ALL_PAGESIZE = 1000;
    const projectsMap = useLiveQuery(async () => {
        const startTime = new Date().getTime();
        const cachedProjects = await getItemsFromCache('projects', 1, ALL_PAGESIZE)
        // console.log({ cachedProjects })

        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        if (duration > 500) {
            toast.info(`Projects QueryDuration: ${duration} ms`, { autoClose: 5 * 1000, position: "bottom-right" });
        }
        return new Map(cachedProjects.map(item => [item.id, item]));
    }, []);

    const tagsMap = useLiveQuery(async () => {
        const startTime = new Date().getTime();
        const cachedTags = await getItemsFromCache('tags', 1, ALL_PAGESIZE);
        // console.log({ cachedTags })

        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        if (duration > 500) {
            toast.info(`Tags QueryDuration: ${duration} ms`, { autoClose: 5 * 1000, position: "bottom-right" });
        }
        return new Map(cachedTags.map(item => [item.id, item]));
    }, []);

    const categoriesMap = useLiveQuery(async () => {
        const startTime = new Date().getTime();
        const cachedCategories = await getItemsFromCache('categories', 1, ALL_PAGESIZE)
        // console.log({ cachedCategories })

        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        if (duration > 500) {
            toast.info(`Categories QueryDuration: ${duration} ms`, { autoClose: 5 * 1000, position: "bottom-right" });
        }
        return new Map(cachedCategories.map(item => [item.id, item]));
    })

    const tasksMap = useLiveQuery(async () => {
        const startTime = new Date().getTime();
        const cachedTasks = await db['tasks'].toArray();
        // console.log({ cachedTasks })

        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        if (duration > 500) {
            toast.info(`Tasks QueryDuration: ${duration} ms`, { autoClose: 5 * 1000, position: "bottom-right" });
        }
        return new Map(cachedTasks.map(item => [item.id, item]));
    }, []);

    const todaysPomodoros = useLiveQuery(async () => {
        const startTime = new Date().getTime();

        let startDate = moment().startOf('day').toISOString();
        let endDate = moment().startOf('day').add(1, 'd').toISOString();    // NOTE: exact current moment not working for new pomodoro
        const pomodoros = await db['pomodoros']
            .where('endTime')
            .between(startDate, endDate, false, true)
            .filter(pomodoro => pomodoro.status === 'past' || pomodoro.status === 'completed')
            .toArray();
        // console.debug(`Retrieved all pomodoros from cache after update:`, { pomodoros });

        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        if (duration > 500) {
            toast.info(`Pomodoros QueryDuration: ${duration} ms`, { autoClose: 5 * 1000, position: "bottom-right" });
        }
        return pomodoros;
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