import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, PrimaryColumn } from "typeorm"
import 'reflect-metadata';
import { CrawlRecord } from "./CrawlRecord.js";

@Entity()
export class Website {
    @PrimaryGeneratedColumn()
    id?: string;

    @Column()
    label: string;

    @Column()
    url: string;

    @Column()
    regexp: string;

    @Column('simple-array')
    tags: string[];

    @Column()
    active: boolean;

    @OneToMany(() => CrawlRecord, crawlRecord => crawlRecord.owner, { onDelete: 'CASCADE' })
    crawlRecords?: CrawlRecord[];

    constructor(label: string, url: string, regexp: string, tags: string[], active: boolean) {
        this.label = label;
        this.url = url;
        this.regexp = regexp;
        this.tags = tags;
        this.active = active;
    }
}