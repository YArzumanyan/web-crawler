export type Node = {
  id: number;
  title: string;
  crawlTime: number;
  links: any;
  owner: number;
};

export type Website = {
  id: number;
  label: string;
  url: string;
  regexp: string;
  tags: string[];
  active: boolean;
  periodicity?: number;
};

export interface WebsiteWithNodes extends Website {
  nodes: Node[];
}
