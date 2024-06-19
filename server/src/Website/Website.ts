import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, PrimaryColumn } from "typeorm"
import 'reflect-metadata';
import { CrawlRecord } from "../Node/CrawlRecord.js";
import { CrawlerPeriodicExecutor } from "../Executor/CrawlerPeriodicExecutor.js";
import { CrawlerExecutor } from "../Executor/CrawlerExecutor.js";

@Entity()
export class Website {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    label: string;

    @Column()
    url: string;

    @Column()
    regexp: string;

    @Column()
    periodicity: number;

    @Column('simple-array')
    tags: string[];

    @Column()
    active: boolean;

    @OneToMany(() => CrawlRecord, crawlRecord => crawlRecord.owner, { onDelete: 'CASCADE' })
    crawlRecords?: CrawlRecord[];

    crawlingPeriodicExecutor: CrawlerPeriodicExecutor | undefined; 
    crawlingExecutor: CrawlerExecutor | undefined;

    constructor(label: string, url: string, regexp: string, tags: string[], periodicity: number, active: boolean) {
        this.label = label;
        this.url = url;
        this.regexp = regexp;
        this.tags = tags;
        this.periodicity = periodicity;
        this.active = active;
    }

    update(label: string, url: string, regexp: string, tags: string[], periodicity: number, active: boolean) {
        this.label = label;
        this.url = url;
        this.regexp = regexp;
        this.tags = tags;
        this.periodicity = periodicity;
        this.active = active;
    }

    updateByWebsite(website: Website) {
        this.label = website.label;
        this.url = website.url;
        this.regexp = website.regexp;
        this.tags = website.tags;
        this.periodicity = website.periodicity;
        this.active = website.active;
    }
}