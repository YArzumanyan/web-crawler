export type Node = {
  id: string;
  title: string;
  url: string;
  crawlTime: number;
  links: Node[];
  matchLinksRecordIds: string[];
  owner: Website;
};

export type Website = {
  id: string;
  label: string;
  url: string;
  regexp: string;
  tags: string[];
  active: boolean;
  periodicity?: number;
};

export type WebsiteInput = {
  label: string;
  url: string;
  boundaryRegExp: string;
  tags: string[];
  active: boolean;
  periodicity?: number;
};

export interface WebsiteWithNodes extends Website {
  crawlRecords: Node[];
}
