/**
 * Parameters necessary for a crawling task
 */
export class CrawlingParameters {
    constructor(url, boundaryRegExp, periodicity, label, isActive = true, tags = []) {
        this.url = url;
        this.boundaryRegExp = boundaryRegExp;
        this.periodicity = periodicity;
        this.label = label;
        this.isActive = isActive;
        this.tags = tags;
    }
}
