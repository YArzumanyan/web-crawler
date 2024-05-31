import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, PrimaryColumn } from "typeorm"
import 'reflect-metadata';
import { on } from "events";

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

    matchLinksRecord: CrawlRecord[];

    @Column('simple-array')
    notMatchLinks: string[];

    constructor(url: string, 
        crawlTime: number, 
        title: string, 
        matchLinksRecordIds: string[],
        matchLinksRecord: CrawlRecord[],
        notMatchLinks: string[]) {
        this.url = url;
        this.crawlTime = crawlTime;
        this.title = title;
        this.matchLinksRecordIds = matchLinksRecordIds;
        this.matchLinksRecord = matchLinksRecord;
        this.notMatchLinks = notMatchLinks;
    }
}
