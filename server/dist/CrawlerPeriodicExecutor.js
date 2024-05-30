/**
 * Periodically executes the crawler.
 */
export class CrawlerPeriodicExecutor {
    constructor(crawlerExecutor, period) {
        this.crawlerExecutor = crawlerExecutor;
        this.period = period;
    }
    start() {
        if (this.period === -1) {
            return;
        }
        this.interval = setInterval(() => {
            this.crawlerExecutor.letsCrawl();
        }, typeof this.period === 'number' ? this.period : parseInt(this.period, 10));
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
