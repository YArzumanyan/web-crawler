import { parentPort, workerData } from "worker_threads";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { CrawlRecord } from "../Node/CrawlRecord.js";
import { databaseEntry } from "../DatabaseEntry.js";

interface CrawlParams {
  url: string;
  regexp: string;
  websiteId: string;
  expirationTime: number;
}

const allFoundMatchedHandledUrls: Record<string, CrawlRecord> = {};

async function crawl({
  url,
  regexp,
  websiteId,
  expirationTime,
}: CrawlParams): Promise<CrawlRecord | null> {
  const boundaryRegExp = new RegExp(regexp);
  const startTime = Date.now();

  if (allFoundMatchedHandledUrls[url]) {
    return allFoundMatchedHandledUrls[url];
  }

  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const title = document.querySelector("title")?.textContent || "No title";

  const links = Array.from(document.querySelectorAll("a, link"))
    .map((element) => (element as HTMLLinkElement).href)
    .filter((link) => boundaryRegExp.test(link));

  const crawlTime = Date.now();
  const website = await databaseEntry.getWebsiteById(websiteId);
  const record = new CrawlRecord(
    url,
    crawlTime,
    title,
    [],
    [],
    website ? website : undefined
  );

  allFoundMatchedHandledUrls[url] = record;

  for (const link of links) {
    if (Date.now() - startTime > expirationTime) {
      console.log("Crawling time exceeded during crawling of: " + url);
      break;
    }

    const validLink = link.startsWith("http") ? link : new URL(link, url).href;

    if (validLink === url) {
      continue;
    }

    if (!(validLink in allFoundMatchedHandledUrls)) {
      const subRecord = await crawl({
        url: validLink,
        regexp,
        websiteId,
        expirationTime,
      });
      if (subRecord) {
        record.matchLinksRecord.push(subRecord);
      }
    } else if (
      !record.matchLinksRecord.includes(allFoundMatchedHandledUrls[validLink])
    ) {
      record.matchLinksRecord.push(allFoundMatchedHandledUrls[validLink]);
    }
  }

  return record;
}

parentPort?.on("message", async (params: CrawlParams) => {
  const result = await crawl(params);
  parentPort?.postMessage(result);
});
