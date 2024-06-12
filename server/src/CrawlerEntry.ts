// entry API for the crawler

import { letsCrawl } from './CrawlerExecutor.js'; 
import { CrawlRecord } from './CrawlRecord.js';
import { CrawlingParameters } from './CrawlingParameters.js';
import { databaseEntry } from './DatabaseEntry.js'; 
import { Website } from './Website.js';

const allCrawlingParameters: CrawlingParameters[] = [];

export async function newTask(crawlingParameters: CrawlingParameters): Promise<CrawlRecord | null> {
    // -> perform the crawling task, it results in a record
    // -> save the parameters in local memory
    // -> save the record in the database
    
    allCrawlingParameters.push(crawlingParameters);
    const { label, url, boundaryRegExp, tags, isActive } = crawlingParameters;
    
    const website = new Website(label, url, boundaryRegExp.source, tags, isActive);        
    const record = await letsCrawl(crawlingParameters, website);

    if (record) {
        await databaseEntry.saveCrawlRecord(record);
    }

    return record;
}

export function getAllTasks(): CrawlingParameters[] {
    return allCrawlingParameters;
}

export async function getCrawlRecord(CrawlingParameters: CrawlingParameters): Promise<CrawlRecord | null> {
    // -> get the record from the database
    if (!CrawlingParameters.recordId) {
        return null;
    }
    return await databaseEntry.getCrawlRecord(CrawlingParameters.recordId);
}

export async function getCrawlRecordById(id: string): Promise<CrawlRecord | null> {
    return await databaseEntry.getCrawlRecord(id);
}

/**
 * @returns true if the task was removed, false otherwise
 * false can be returned if the task was not found in the local memory
 */
export function removeTask(crawlingParameters: CrawlingParameters): boolean {
    // -> remove the task from the database 
    // -> remove the parameters from local memory

    // check if parameters are in local memory
    const index = allCrawlingParameters.indexOf(crawlingParameters);
    if (index < 0) {
        return false;
    }

    if (!crawlingParameters.recordId) {
        return false;
    }

    databaseEntry.removeCrawlRecord(crawlingParameters.recordId);

    // remove parameters from local memory
    allCrawlingParameters.splice(index, 1);
    return true;
}

// TODO: Has redundant code, fix it
export async function removeTaskById(id: string): Promise<boolean> {
    const crawlingParameters = allCrawlingParameters.find((c) => c.recordId === id);
    if (!crawlingParameters) {
        return false;
    }

    return removeTask(crawlingParameters);
}
