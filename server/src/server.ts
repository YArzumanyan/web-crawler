import express from 'express';
import cors from 'cors';

import "reflect-metadata"
import { CrawlingParametersBuilder } from './CrawlerExecutor.js';
import { newTask, getAllTasks, getCrawlRecord, removeTask } from './CrawlerEntry.js';
import { CrawlRecord } from './CrawlRecord.js';

const crawlingParameters = new CrawlingParametersBuilder()
    .setUrl('https://www.wikipedia.org/')
    .setBoundaryRegExp(new RegExp('//ru.wikipedia.org/'))
    .setLabel('example')
    .setTags(['example'])
    .setPeriodInMs(1000 * 10)
    .build();


const crawlingParameters2 = new CrawlingParametersBuilder()
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

record.then((r: CrawlRecord | null) => {
    console.log('LETS GET TASK BY PARAMS');

    var allFoundMatchedHandledUrls: Record<string, CrawlRecord> = {};
    if (r) {
        const queue: CrawlRecord[] = [];

        queue.push(r);

        let numberToNextLevel = 1;

        while (queue.length > 0) {
            const record = queue.shift();

            if (record) {
                if(allFoundMatchedHandledUrls[record.url]) {
                    continue;
                }

                allFoundMatchedHandledUrls[record.url] = record;

                console.log(record.url);

                if (record.matchLinksRecordIds.length <= 3) {
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

        getCrawlRecord(crawlingParameters).then((gotRecord) => {
            console.log('GOT RECORD:');
            console.log(gotRecord);
            // go through the records and print URL according increasing layers of graph 
        }).then(() => {
            console.log('LETS REMOVE TASK');
            removeTask(crawlingParameters);
        });
    
    }
});

const app = express();
const port = 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
