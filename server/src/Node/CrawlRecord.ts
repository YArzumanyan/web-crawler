import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, PrimaryColumn } from "typeorm"
import 'reflect-metadata';
import { Website } from "../Website/Website.js";

@Entity()
export class CrawlRecord {
    @PrimaryGeneratedColumn()
    id?: string;

    @Column()
    url: string;

    @Column('bigint')
    crawlTime: number;

    @Column()
    title: string;

    @Column('simple-array')
    matchLinksRecordIds: string[];

    @ManyToOne(() => Website, website => website.crawlRecords, { cascade: ["insert", "update"]})
    owner: Website;

    matchLinksRecord: CrawlRecord[];

    constructor(url: string, 
        crawlTime: number, 
        title: string, 
        matchLinksRecordIds: string[],
        matchLinksRecord: CrawlRecord[],
        owner: Website) {
        this.url = url;
        this.crawlTime = crawlTime;
        this.title = title;
        this.owner = owner;
        this.matchLinksRecordIds = matchLinksRecordIds;
        this.matchLinksRecord = matchLinksRecord;
    }
}
