import { CrawlingParameters } from './CrawlingParameters.js';
/**
 * Parameters necessary for a crawling task
 */
export class CrawlingParametersBuilder {
    constructor() {
        this.url = '';
        this.boundaryRegExp = new RegExp('');
        this.period = -1;
        this.label = '';
        this.isActive = true;
        this.tags = [];
    }
    setUrl(url) {
        if (typeof url !== 'string')
            throw new Error('URL must be a string');
        this.url = url;
        return this;
    }
    /**
     * @param {*} regExp - regular expression for boundary, an URL that matches this regular expression will crawled
     */
    setBoundaryRegExp(regExp) {
        this.boundaryRegExp = regExp;
        return this;
    }
    /**
     * @param {*} period - how often to crawl the URL in milliseconds
     */
    setPeriodInMs(period) {
        this.period = period;
        return this;
    }
    setLabel(label) {
        if (typeof label !== 'string')
            throw new Error('Label must be a string');
        this.label = label;
        return this;
    }
    setIsActive(isActive) {
        if (typeof isActive !== 'boolean')
            throw new Error('Active status must be a boolean');
        this.isActive = isActive;
        return this;
    }
    setTags(tags) {
        if (!Array.isArray(tags))
            throw new Error('Tags must be an array');
        this.tags = tags;
        return this;
    }
    build() {
        if (!this.url)
            throw new Error('URL is required');
        if (!this.boundaryRegExp)
            throw new Error('Boundary RegExp is required');
        if (!this.label)
            throw new Error('Label is required');
        return new CrawlingParameters(this.url, this.boundaryRegExp, this.period, this.label, this.isActive, this.tags);
    }
}
