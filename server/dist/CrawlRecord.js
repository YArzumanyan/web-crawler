var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import 'reflect-metadata';
let CrawlRecord = class CrawlRecord {
    constructor(url, crawlTime, title, matchLinksRecords, notMatchLinks) {
        this.url = url;
        this.crawlTime = crawlTime;
        this.title = title;
        this.matchLinksRecords = matchLinksRecords;
        this.notMatchLinks = notMatchLinks;
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CrawlRecord.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], CrawlRecord.prototype, "url", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], CrawlRecord.prototype, "crawlTime", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], CrawlRecord.prototype, "title", void 0);
__decorate([
    OneToMany(() => CrawlRecord, (record) => record.matchLinksRecords),
    __metadata("design:type", Array)
], CrawlRecord.prototype, "matchLinksRecords", void 0);
__decorate([
    Column("simple-array"),
    __metadata("design:type", Array)
], CrawlRecord.prototype, "notMatchLinks", void 0);
__decorate([
    ManyToOne(() => CrawlRecord, (record) => record.matchLinksRecords),
    __metadata("design:type", CrawlRecord)
], CrawlRecord.prototype, "parent", void 0);
CrawlRecord = __decorate([
    Entity(),
    __metadata("design:paramtypes", [String, Number, String, Array, Array])
], CrawlRecord);
export { CrawlRecord };
