// entry API for the crawler

import { letsCrawl } from '../Executor/CrawlerExecutor.js'; 
import { CrawlRecord } from './CrawlRecord.js';
import { databaseEntry } from '../DatabaseEntry.js'; 
import { Website } from '../Website/Website.js';
import Dictionary from '../dictionary.js';

const runningTasks = Dictionary.getInstance<number, Website>('runningTasks');

export async function newTask(website: Website): Promise<Website> {
    // -> perform the crawling task, it results in a record
    // -> save the parameters in local memory
    // -> save the record in the database
    const record = await letsCrawl(website);

    if (record) {
        await databaseEntry.saveCrawlRecord(record);
    }

    return record?.owner!;
}

export async function getTask(id: number): Promise<Website | null> {
    // -> get the parameters from local memory
    // -> get the parameters from the database

    if (runningTasks.has(id)) {
        return runningTasks.get(id)!;
    }

    return await databaseEntry.getWebsiteById(id);
}

export async function getAllTasks(): Promise<Website[]> {
    // -> get all the parameters from local memory
    // -> get all the parameters from the database

    return await databaseEntry.getWebsites();
}

export async function getCrawlRecord(id: string): Promise<CrawlRecord | null> {
    // -> get the record from the database

    return await databaseEntry.getCrawlRecord(id);
}

/**
 * @returns true if the task was removed, false otherwise
 * false can be returned if the task was not found in the local memory
 */
export async function removeTask(website: Website): Promise<boolean> {
    // -> remove the task from the database 
    // -> remove the parameters from local memory
    if (!website.id) {
        return false;
    }

    const oldTask = runningTasks.get(website.id);
    oldTask?.crawlingPeriodicExecutor?.stop();
    runningTasks.delete(website.id);
    website.active = false;
    await databaseEntry.updateWebsite(website);
    // databaseEntry.removeWebsite(website.id);
    
    return true;
}

export async function updateTask(website: Website): Promise<boolean> {
    // -> update the task in the database
    // -> update the parameters in local memory
    if (!website.id) {
        return false;
    }

    const oldTask = runningTasks.get(website.id);
    oldTask?.crawlingPeriodicExecutor?.stop();
    runningTasks.delete(website.id);
    if (website.active) {
        await newTask(website);
    }

    return true;
}

export function removeTaskById(id: number): boolean {
    // -> remove the task from the database 
    // -> remove the parameters from local memory
    const oldTask = runningTasks.get(id);
    oldTask?.crawlingPeriodicExecutor?.stop();
    runningTasks.delete(id);

    return true;
}
