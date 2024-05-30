// entry API for the crawler
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { letsCrawl } from './CrawlerExecutor.js';
import { databaseEntry } from './DatabaseEntry.js';
const allCrawlingParameters = [];
export function newTask(crawlingParameters) {
    return __awaiter(this, void 0, void 0, function* () {
        // -> perform the crawling task, it results in a record
        // -> save the parameters in local memory
        // -> save the record in the database
        allCrawlingParameters.push(crawlingParameters);
        const record = yield letsCrawl(crawlingParameters);
        if (record) {
            const id = yield databaseEntry.saveCrawlRecord(record);
            crawlingParameters.recordId = id;
        }
        return record;
    });
}
export function getAllTasks() {
    return allCrawlingParameters;
}
export function getCrawlRecord(CrawlingParameters) {
    return __awaiter(this, void 0, void 0, function* () {
        // -> get the record from the database
        if (!CrawlingParameters.recordId) {
            return null;
        }
        return yield databaseEntry.getCrawlRecord(CrawlingParameters.recordId);
    });
}
/**
 * @returns true if the task was removed, false otherwise
 * false can be returned if the task was not found in the local memory
 */
export function removeTask(crawlingParameters) {
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
