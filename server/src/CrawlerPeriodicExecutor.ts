
import { CrawlRecord } from "./CrawlRecord.js";
import { databaseEntry } from "./DatabaseEntry.js";
/**
 * Periodically executes the crawler.
 */
export class CrawlerPeriodicExecutor {
    crawlerExecutor: any; 
    period: number;
    interval: NodeJS.Timeout | undefined;

    constructor(crawlerExecutor: any, period: number) {
        this.crawlerExecutor = crawlerExecutor;
        this.period = period;
    }

    start(): void {
        if (this.period === -1) {
            return;
        }
        this.interval = setInterval(() => {
            this.crawlerExecutor.letsCrawl().then((newRecord: CrawlRecord | null) => {
                if (newRecord) {
                    databaseEntry.updateCrawlRecord(newRecord);
                }
            });

        }, typeof this.period === 'number' ? this.period : parseInt(this.period, 10));
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}