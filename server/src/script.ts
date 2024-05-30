// example of crawler usage

import "reflect-metadata"
import { letsCrawl, CrawlingParametersBuilder } from './CrawlerExecutor.js';
import { newTask, getAllTasks, getCrawlRecord, removeTask } from './CrawlerEntry.js';
import { AppDataSource } from './DatabaseEntry.js';

const crawlingParameters = new CrawlingParametersBuilder()
    .setUrl('https://www.wikipedia.org/')
    .setBoundaryRegExp(new RegExp('//ru.wikipedia.org/'))
    .setLabel('example')
    .setTags(['example'])
    .build();

AppDataSource.logger.logQuery('lets initialize database');

const record = letsCrawl(crawlingParameters);

//const record = newTask(crawlingParameters);
