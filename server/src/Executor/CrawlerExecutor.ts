import { Worker } from "worker_threads";
import { Website } from "../Website/Website.js";
import { CrawlRecord } from "../Node/CrawlRecord.js";
import Dictionary from "../dictionary.js";
import { CrawlerPeriodicExecutor } from "./CrawlerPeriodicExecutor.js";

const runningTasks = Dictionary.getInstance<string, Website>("runningTasks");

async function prepareAndRunCrawl(owner: Website): Promise<CrawlRecord | null> {
  if (runningTasks.has(owner.id!)) {
    return null;
  }

  owner.crawlingExecutor = new CrawlerExecutor(owner);
  const crawlRecord = await owner.crawlingExecutor.letsCrawl();

  owner.crawlingPeriodicExecutor = new CrawlerPeriodicExecutor(
    owner.crawlingExecutor,
    owner.periodicity
  );
  owner.crawlingPeriodicExecutor.start();

  runningTasks.set(owner.id!, owner);

  return crawlRecord;
}

class CrawlerExecutor {
  #crawlExpirationTimeInMs: number = 1000 * 60 * 5;
  private website: Website;

  constructor(
    website: Website,
    crawlExpirationTimeInMs: number = 1000 * 60 * 5
  ) {
    this.#crawlExpirationTimeInMs = crawlExpirationTimeInMs;
    this.website = website;
  }

  setOwner(website: Website): void {
    this.website = website;
  }

  getOwnerId(): string | undefined {
    return this.website.id;
  }

  async letsCrawl(): Promise<CrawlRecord | null> {
    return new Promise((resolve, reject) => {
      const worker = new Worker("./dist/Executor/CrawlerWorker.js", {
        workerData: null,
      });

      const crawlParams = {
        url: this.website.url,
        regexp: this.website.regexp,
        websiteId: this.website.id,
        expirationTime: this.#crawlExpirationTimeInMs,
      };

      worker.postMessage(crawlParams);

      worker.on("message", (result) => {
        resolve(result);
      });

      worker.on("error", reject);

      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }
}

export { prepareAndRunCrawl as letsCrawl, CrawlerExecutor };
