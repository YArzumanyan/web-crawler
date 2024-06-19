// example of crawler usage

// task is created with CrawlingParameter class, 
// the info about concrete task is cached in the local memory
// in the same class parameters yet. 

// The output of crawling is called CrawlRecord, it is 
// saved in the database.

import "reflect-metadata"
import { newTask, getAllTasks, getCrawlRecord, removeTask } from './Node/CrawlerEntry.js';
import { CrawlRecord } from './Node/CrawlRecord.js';
import { WebsiteBuilder } from "./Website/WebsiteBuilder.js";

const crawlingParameters = new WebsiteBuilder()
    .setUrl('https://www.wikipedia.org/')
    .setBoundaryRegExp(new RegExp('//ru.wikipedia.org/'))
    .setLabel('example')
    .setTags(['example'])
    .setPeriodInMs(1000 * 10)
    .build();


const crawlingParameters2 = new WebsiteBuilder()
    .setUrl('https://www.wikipedia.org/')
    .setBoundaryRegExp(new RegExp('//cs.wikipedia.org/'))
    .setLabel('example2')
    .setTags(['example2'])
    .build();


//const record = letsCrawl(crawlingParameters);

console.log('FIRST TASK');
const record = newTask(crawlingParameters);
record.then((r) => {
    console.log('RECORD');
    console.log(r);
});
console.log('SECOND TASK');
const record2 = newTask(crawlingParameters2);

console.log('LETS GET ALL TASKS');
const allTasks = getAllTasks();

console.log(allTasks);


// record.then((r: CrawlRecord | null) => {
//     console.log('LETS GET TASK BY PARAMS');

    // if (r) {
    //     printRecords(r);
    //     getCrawlRecord(crawlingParameters.id).then((gotRecord) => {
    //         console.log('GOT RECORD:');
    //         console.log(gotRecord);
    //         if(gotRecord) {
    //             printRecords(gotRecord);
    //         } else throw new Error('Record not found');
    //     }).then(() => {
    //         console.log('LETS REMOVE TASK');
    //         removeTask(crawlingParameters);
    //     });
    // }
// });

// if the layer is too huge, it will print only the first 5 links
function printRecords(record: CrawlRecord) {
    var allFoundMatchedHandledUrls: Record<string, CrawlRecord> = {};

    console.log('PRINT RECORDS OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOo');
    const queue: CrawlRecord[] = [];
    queue.push(record);
    let numberToNextLevel = 1;
    while (queue.length > 0) {
        const record = queue.shift();

        if (record) {
            if(allFoundMatchedHandledUrls[record.url]) {
                continue;
            }

            allFoundMatchedHandledUrls[record.url] = record;

            console.log(record.url);

            if (record.matchLinksRecordIds.length <= 5) {
                queue.push(...record.matchLinksRecord);
            } else {
                queue.push(...record.matchLinksRecord.slice(0, 3));
            }

            numberToNextLevel--;
            if (numberToNextLevel === 0) {
                numberToNextLevel = queue.length;
                console.log('---');
            }
        }
    }
    console.log('PRINT RECORDS END OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOo');
}
