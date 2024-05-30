import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import 'reflect-metadata';

@Entity()
export class CrawlRecord {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    url: string;

    @Column()
    crawlTime: number;

    @Column()
    title: string;

    @OneToMany(() => CrawlRecord, (record) => record.matchLinksRecords)
    matchLinksRecords: CrawlRecord[];

    @Column("simple-array")
    notMatchLinks: string[];

    @ManyToOne(() => CrawlRecord, (record) => record.matchLinksRecords)
    parent?: CrawlRecord;

    constructor(url: string, crawlTime: number, title: string, matchLinksRecords: CrawlRecord[], notMatchLinks: string[]) {
        this.url = url;
        this.crawlTime = crawlTime;
        this.title = title;
        this.matchLinksRecords = matchLinksRecords;
        this.notMatchLinks = notMatchLinks;
    }
}
