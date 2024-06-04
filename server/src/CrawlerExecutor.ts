import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { CustomLock } from './CustomLock.js';
import { CrawlerPeriodicExecutor } from './CrawlerPeriodicExecutor.js';
import { CrawlingParametersBuilder } from './CrawlingParametersBuilder.js';
import { CrawlingParameters } from './CrawlingParameters.js';
import { CrawlRecord } from './CrawlRecord.js';
import { Website } from './Website.js';

/**
 * Creates a new crawling task, also starts periodic crawling.
 * @param crawlingParameters The parameters for the crawling task.
 * @returns The crawl record.
 */
function prepareAndRunCrawl(crawlingParameters: CrawlingParameters): Promise<CrawlRecord | null> {
    crawlingParameters.crawlingExecutor = new CrawlerExecutor(crawlingParameters);

    const crawlRecord = crawlingParameters.crawlingExecutor.letsCrawl();

    crawlingParameters.crawlingPeriodicExecutor = new CrawlerPeriodicExecutor(
        crawlingParameters.crawlingExecutor, crawlingParameters.periodicity
    );
    crawlingParameters.crawlingPeriodicExecutor.start();

    return crawlRecord;
}

class CrawlerExecutor {
    #crawlExpirationTimeInMs: number = 1000 * 60 * 5;
    private lock: CustomLock;
    private crawlingParameters: CrawlingParameters;
    private crawlingStartTimeInMs!: number;
    private timeExceeded: boolean = false;
    #allFoundMatchedHandledUrls: Record<string, CrawlRecord> = {};

    constructor(crawlingParameters: CrawlingParameters, crawlExpirationTimeInMs: number = 1000 * 60 * 5) {
        this.lock = new CustomLock();
        this.#crawlExpirationTimeInMs = crawlExpirationTimeInMs;
        this.crawlingParameters = crawlingParameters;
    }

    async letsCrawl(): Promise<CrawlRecord | null> {
        if (!this.lock.tryLock()) {
            return null;
        }

        this.#allFoundMatchedHandledUrls = {};

        try {
            const { url, boundaryRegExp, label, tags, isActive } = this.crawlingParameters;

            this.crawlingStartTimeInMs = Date.now();
            this.timeExceeded = false;

            let record: CrawlRecord | null;
            try {
                const website = new Website(label, url, boundaryRegExp.source, tags, isActive);
                record = await this.#crawlRecursion(url, boundaryRegExp, website);
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

    async #crawlRecursion(url: string, boundaryRegExp: RegExp, website?: Website): Promise<CrawlRecord | null> {
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
            url, crawlTime, title || "No title", [], [], [], website);

        this.#allFoundMatchedHandledUrls[url] = record;

        for (const link of filteredLinks) {
            const validLink = link.startsWith('http') ? link : new URL(link, url).href;

            if (validLink === url) {
                continue;
            }
            if (!(validLink in this.#allFoundMatchedHandledUrls)) {
                let subRecord: CrawlRecord | null;
                try {
                    // Create a new website object for each link
                    const subWebsite = new Website(this.crawlingParameters.label, validLink, boundaryRegExp.source, this.crawlingParameters.tags, this.crawlingParameters.isActive);
                    subRecord = await this.#crawlRecursion(validLink, boundaryRegExp, subWebsite);
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
    CrawlingParametersBuilder,
};
