var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CrawlerExecutor_instances, _CrawlerExecutor_crawlExpirationTimeInMs, _CrawlerExecutor_allFoundMatchedHandledUrls, _CrawlerExecutor_isCrawlingTimeExceeded, _CrawlerExecutor_crawlRecursion;
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { CustomLock } from './CustomLock.js';
import { CrawlerPeriodicExecutor } from './CrawlerPeriodicExecutor.js';
import { CrawlingParametersBuilder } from './CrawlingParametersBuilder.js';
/**
 * Creates a new crawling task.
 * @param crawlingParameters The parameters for the crawling task.
 * @returns The crawl record.
 */
function prepareAndRunCrawl(crawlingParameters) {
    crawlingParameters.crawlingExecutor = new CrawlerExecutor(crawlingParameters);
    const crawlRecord = crawlingParameters.crawlingExecutor.letsCrawl();
    crawlingParameters.crawlingPeriodicExecutor = new CrawlerPeriodicExecutor(crawlingParameters.crawlingExecutor, crawlingParameters.periodicity);
    crawlingParameters.crawlingPeriodicExecutor.start();
    return crawlRecord;
}
class CrawlerExecutor {
    constructor(crawlingParameters, crawlExpirationTimeInMs = 1000 * 60 * 5) {
        _CrawlerExecutor_instances.add(this);
        _CrawlerExecutor_crawlExpirationTimeInMs.set(this, 1000 * 60 * 5);
        this.timeExceeded = false;
        _CrawlerExecutor_allFoundMatchedHandledUrls.set(this, {});
        this.lock = new CustomLock();
        __classPrivateFieldSet(this, _CrawlerExecutor_crawlExpirationTimeInMs, crawlExpirationTimeInMs, "f");
        this.crawlingParameters = crawlingParameters;
    }
    letsCrawl() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lock.tryLock()) {
                return null;
            }
            __classPrivateFieldSet(this, _CrawlerExecutor_allFoundMatchedHandledUrls, {}, "f");
            try {
                const { url, boundaryRegExp } = this.crawlingParameters;
                this.crawlingStartTimeInMs = Date.now();
                this.timeExceeded = false;
                let record;
                try {
                    record = yield __classPrivateFieldGet(this, _CrawlerExecutor_instances, "m", _CrawlerExecutor_crawlRecursion).call(this, url, boundaryRegExp);
                }
                catch (e) {
                    console.error('Error during crawling: ' + e);
                    return null;
                }
                console.log('Crawling finished');
                console.log(record);
                return record;
            }
            finally {
                __classPrivateFieldSet(this, _CrawlerExecutor_allFoundMatchedHandledUrls, {}, "f");
                this.lock.unlock();
            }
        });
    }
}
_CrawlerExecutor_crawlExpirationTimeInMs = new WeakMap(), _CrawlerExecutor_allFoundMatchedHandledUrls = new WeakMap(), _CrawlerExecutor_instances = new WeakSet(), _CrawlerExecutor_isCrawlingTimeExceeded = function _CrawlerExecutor_isCrawlingTimeExceeded() {
    const currentTimeInMs = Date.now();
    const duration = currentTimeInMs - this.crawlingStartTimeInMs;
    if (duration > __classPrivateFieldGet(this, _CrawlerExecutor_crawlExpirationTimeInMs, "f")) {
        return true;
    }
    return false;
}, _CrawlerExecutor_crawlRecursion = function _CrawlerExecutor_crawlRecursion(url, boundaryRegExp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (__classPrivateFieldGet(this, _CrawlerExecutor_instances, "m", _CrawlerExecutor_isCrawlingTimeExceeded).call(this)) {
            console.log('Crawling time exceeded during crawling of: ' + url);
            this.timeExceeded = true;
            return null;
        }
        console.log(`Crawling: ${url}`);
        const response = yield fetch(url);
        const html = yield response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const title = document.querySelector('title') ? document.querySelector('title').textContent : 'No title';
        const a_links = [...document.querySelectorAll('a')].map(a => a.href);
        const links_links = [...document.querySelectorAll('link')].map(link => link.href);
        const links = [...a_links, ...links_links];
        const boundaryRegex = new RegExp(boundaryRegExp);
        const filteredLinks = links.filter(link => boundaryRegex.test(link));
        const notMatchLinks = links.filter(link => !boundaryRegex.test(link));
        const crawlTime = Date.now();
        const record = {
            url,
            crawlTime,
            title: title || 'No title',
            matchLinksRecords: [],
            notMatchLinks: notMatchLinks
        };
        __classPrivateFieldGet(this, _CrawlerExecutor_allFoundMatchedHandledUrls, "f")[url] = record;
        for (const link of filteredLinks) {
            const validLink = link.startsWith('http') ? link : new URL(link, url).href;
            if (validLink === url) {
                continue;
            }
            if (!(validLink in __classPrivateFieldGet(this, _CrawlerExecutor_allFoundMatchedHandledUrls, "f"))) {
                let subRecord;
                try {
                    subRecord = yield __classPrivateFieldGet(this, _CrawlerExecutor_instances, "m", _CrawlerExecutor_crawlRecursion).call(this, validLink, boundaryRegExp);
                }
                catch (e) {
                    console.error("Unable to crawl: " + validLink + " due to error: " + e);
                    continue;
                }
                if (this.timeExceeded) {
                    break;
                }
                if (subRecord) {
                    record.matchLinksRecords.push(subRecord);
                }
            }
            else if (!record.matchLinksRecords.includes(__classPrivateFieldGet(this, _CrawlerExecutor_allFoundMatchedHandledUrls, "f")[validLink])) {
                record.matchLinksRecords.push(__classPrivateFieldGet(this, _CrawlerExecutor_allFoundMatchedHandledUrls, "f")[validLink]);
            }
        }
        return record;
    });
};
export { prepareAndRunCrawl as letsCrawl, CrawlingParametersBuilder, };
