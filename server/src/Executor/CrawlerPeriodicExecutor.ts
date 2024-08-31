import { CrawlRecord } from "../Node/CrawlRecord.js";
import { databaseEntry } from "../DatabaseEntry.js";

/**
 * Periodically executes the crawler.
 */
export class CrawlerPeriodicExecutor {
  private crawlerExecutor: any;
  private period: number;
  private interval: NodeJS.Timeout | undefined;

  constructor(crawlerExecutor: any, period: number) {
    this.crawlerExecutor = crawlerExecutor;
    this.period = period;
  }

  start(): void {
    if (this.period === -1) {
      return;
    }
    this.interval = setInterval(
      async () => {
        const owner = this.crawlerExecutor.getOwnerId();
        if (!owner) {
          return;
        }

        await databaseEntry.removeWebsiteCrawlRecords(owner);
        this.crawlerExecutor
          .letsCrawl()
          .then((newRecord: CrawlRecord | null) => {
            if (newRecord) {
              databaseEntry.saveCrawlRecord(newRecord);
            }
          });
      },
      typeof this.period === "number" ? this.period : parseInt(this.period, 10)
    );
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
