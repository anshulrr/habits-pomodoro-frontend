// create a context
// Put some state in the context
// Share the created context with other components

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, useContext, useEffect, useState } from "react";

import { db } from "services/db";
import { clearCacheDb, getItemsCountFromCache, getItemsFromCache, syncDirtyEntities, syncEntitiesDelta } from "services/dbService";

const DataContext = createContext();
export const useData = () => useContext(DataContext)

export default function DataProvider({ children }) {

    const [reloadTags, setReloadTags] = useState(0);

    const ALL_PAGESIZE = 1000;
    const projectsCount = useLiveQuery(async () => getItemsCountFromCache('projects'));
    const projectsMap = useLiveQuery(async () => {
        const cachedProjects = await getItemsFromCache('projects', 1, ALL_PAGESIZE)

        return new Map(cachedProjects.map(item => [item.id, item]));
    }, []);

    const tagsCount = useLiveQuery(async () => getItemsCountFromCache('tags'));
    const tagsMap = useLiveQuery(async () => {
        const cachedTags = await getItemsFromCache('tags', 1, ALL_PAGESIZE);
        setReloadTags(prev => prev + 1);
        return new Map(cachedTags.map(item => [item.id, item]));
    }, []);

    const categoriesMap = useLiveQuery(async () => {
        const cachedCategories = await getItemsFromCache('categories', 1, ALL_PAGESIZE)
        return new Map(cachedCategories.map(item => [item.id, item]));
    })

    const valuesToBeShared = { projectsMap, tagsMap, categoriesMap }

    return (
        tagsMap &&
        <DataContext.Provider value={valuesToBeShared}>
            {children}
        </DataContext.Provider>
    )
}