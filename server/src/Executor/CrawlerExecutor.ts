import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { CustomLock } from '../CustomLock.js';
import { CrawlerPeriodicExecutor } from './CrawlerPeriodicExecutor.js';
import { CrawlRecord } from '../Node/CrawlRecord.js';
import { Website } from '../Website/Website.js';

export const runningTasks = new Map<number, Website>();

/**
 * Creates a new crawling task, also starts periodic crawling.
 * @param crawlingParameters The parameters for the crawling task.
 * @returns The crawl record.
 */
async function prepareAndRunCrawl(owner: Website): Promise<CrawlRecord | null> {
    if (runningTasks.has(owner.id!)) {
        return null;
    }

    owner.crawlingExecutor = new CrawlerExecutor(owner);
    const crawlRecord = await owner.crawlingExecutor.letsCrawl();

    owner.crawlingPeriodicExecutor = new CrawlerPeriodicExecutor(
        owner.crawlingExecutor, owner.periodicity
    );
    owner.crawlingPeriodicExecutor.start();

    runningTasks.set(owner.id!, owner);

    return crawlRecord;
}

class CrawlerExecutor {
    #crawlExpirationTimeInMs: number = 1000 * 60 * 5;
    private lock: CustomLock;
    private crawlingStartTimeInMs!: number;
    private timeExceeded: boolean = false;
    private website: Website;
    #allFoundMatchedHandledUrls: Record<string, CrawlRecord> = {};

    constructor(website: Website, crawlExpirationTimeInMs: number = 1000 * 60 * 5) {
        this.lock = new CustomLock();
        this.#crawlExpirationTimeInMs = crawlExpirationTimeInMs;
        this.website = website;
    }

    setOwner(website: Website): void {
        this.website = website;
    }

    getOwner(): Website | null {
        return this.website;
    }

    async letsCrawl(): Promise<CrawlRecord | null> {
        if (!this.lock.tryLock()) {
            return null;
        }

        this.#allFoundMatchedHandledUrls = {};

        try {
            const { url, regexp } = this.website;

            this.crawlingStartTimeInMs = Date.now();
            this.timeExceeded = false;

            let record: CrawlRecord | null;
            try {
                record = await this.#crawlRecursion(url, new RegExp(regexp));
            } catch (e) {
                console.error('Error during crawling: ' + e);
                return null;
            }

            return record;
        } finally {
            this.#allFoundMatchedHandledUrls = {};
            this.lock.unlock();
        }
    }

    #isCrawlingTimeExceeded(): boolean {
        const currentTimeInMs = Date.now();
        const duration = currentTimeInMs - this.crawlingStartTimeInMs;
        if (duration > this.#crawlExpirationTimeInMs) {
            return true;
        }
        return false;
    }

    async #crawlRecursion(url: string, boundaryRegExp: RegExp): Promise<CrawlRecord | null> {
        if (this.#isCrawlingTimeExceeded()) {
            console.log('Crawling time exceeded during crawling of: ' + url);
            this.timeExceeded = true;
            return null;
        }

        // console.log(`Crawling: ${url}`);

        const response = await fetch(url);
        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const title = document.querySelector('title') ? document.querySelector('title')!.textContent : 'No title';

        const a_links = [...document.querySelectorAll('a')].map(a => a.href);
        const links_links = [...document.querySelectorAll('link')].map(link => link.href);
        const links = [...a_links, ...links_links];

        const boundaryRegex = new RegExp(boundaryRegExp);
        const filteredLinks = links.filter(link => boundaryRegex.test(link));
        const notMatchLinks = links.filter(link => !boundaryRegex.test(link));

        const crawlTime = Date.now();

        const record: CrawlRecord = new CrawlRecord(
            url, crawlTime, title || "No title", [], [], this.website || undefined);

        this.#allFoundMatchedHandledUrls[url] = record;

        for (const link of filteredLinks) {
            const validLink = link.startsWith('http') ? link : new URL(link, url).href;

            if (validLink === url) {
                continue;
            }
            if (!(validLink in this.#allFoundMatchedHandledUrls)) {
                let subRecord: CrawlRecord | null;
                try {
                    subRecord = await this.#crawlRecursion(validLink, boundaryRegExp);
                } catch (e) {
                    console.error("Unable to crawl: " + validLink + " due to error: " + e);
                    continue;
                }

                if (this.timeExceeded) {
                    break;
                }

                if (subRecord) {
                    record.matchLinksRecord.push(subRecord);
                }
            } else if (!record.matchLinksRecord.includes(this.#allFoundMatchedHandledUrls[validLink])) {
                record.matchLinksRecord.push(this.#allFoundMatchedHandledUrls[validLink]);
            }
        }

        return record;
    }
}

export {
    prepareAndRunCrawl as letsCrawl,
    CrawlerExecutor
};
