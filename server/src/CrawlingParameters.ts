import {CrawlerPeriodicExecutor} from './CrawlerPeriodicExecutor.js';

/**
 * Parameters necessary for a crawling task
 */
export class CrawlingParameters {
    url: string;
    boundaryRegExp: RegExp;
    periodicity: number;
    label: string;
    isActive: boolean;
    tags: string[];
    crawlingPeriodicExecutor: CrawlerPeriodicExecutor | undefined;
    crawlingExecutor: any;
    recordId: string | undefined;
    constructor(
        url: string, 
        boundaryRegExp: RegExp, 
        periodicity: number, 
        label: string, 
        isActive: boolean = true, 
        tags: string[] = []
    ) {
        this.url = url;
        this.boundaryRegExp = boundaryRegExp;
        this.periodicity = periodicity;
        this.label = label;
        this.isActive = isActive;
        this.tags = tags;
    }
}
