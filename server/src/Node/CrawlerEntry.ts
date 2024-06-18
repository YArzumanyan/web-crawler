// entry API for the crawler

import { letsCrawl } from '../Executor/CrawlerExecutor.js'; 
import { CrawlRecord } from './CrawlRecord.js';
import { databaseEntry } from '../DatabaseEntry.js'; 
import { Website } from '../Website/Website.js';

const allTasks : Map<number, Website> = new Map();

export async function newTask(website: Website): Promise<CrawlRecord | null> {
    // -> perform the crawling task, it results in a record
    // -> save the parameters in local memory
    // -> save the record in the database
    allTasks.set(website.id!, website);
    
    const record = await letsCrawl(website);

    if (record) {
        await databaseEntry.saveCrawlRecord(record);
    }

    return record;
}

export async function getTask(id: number): Promise<Website | null> {
    // -> get the parameters from local memory
    // -> get the parameters from the database

    if (allTasks.has(id)) {
        return allTasks.get(id)!;
    }

    return await databaseEntry.getWebsiteById(id);
}

export function getAllTasks(): Map<number, Website> {
    return allTasks;
}

export async function getCrawlRecord(id: string): Promise<CrawlRecord | null> {
    // -> get the record from the database

    return await databaseEntry.getCrawlRecord(id);
}

/**
 * @returns true if the task was removed, false otherwise
 * false can be returned if the task was not found in the local memory
 */
export function removeTask(website: Website): boolean {
    // -> remove the task from the database 
    // -> remove the parameters from local memory

    // check if parameters are in local memory
    if (!website.id) {
        return false;
    }

    if (!allTasks.has(website.id)) {
        return false;
    }

    const index = allTasks.get(website.id);

    databaseEntry.removeWebsite(website.id);

    // remove parameters from local memory
    allTasks.delete(website.id);
    return true;
}