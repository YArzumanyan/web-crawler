var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataSource, Entity } from 'typeorm';
import { CrawlRecord } from './CrawlRecord.js';
import { PrimaryGeneratedColumn } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
let ExampleEntity = class ExampleEntity {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ExampleEntity.prototype, "id", void 0);
ExampleEntity = __decorate([
    Entity()
], ExampleEntity);
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});
console.log('lets initialize database');
AppDataSource.initialize()
    .then(() => {
    console.log('Database initialized1');
    const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
    crawlRecordRepository.find()
        .then((records) => console.log(records))
        .catch((error) => console.log(error));
    console.log('Database initialized');
})
    .catch((error) => console.log(error));
class DatabaseEntry {
    saveCrawlRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Saving record');
            const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
            const savedRecord = yield crawlRecordRepository.save(record);
            return savedRecord.id;
        });
    }
    removeCrawlRecord(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Removing record');
            const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
            const deleteResult = yield crawlRecordRepository.delete(id);
            return deleteResult.affected !== 0;
        });
    }
    updateCrawlRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Updating record');
            const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
            const updateResult = yield crawlRecordRepository.save(record);
            return !!updateResult;
        });
    }
    getCrawlRecord(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Getting record');
            const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
            const record = yield crawlRecordRepository.findOneBy({
                id: id
            });
            return record || null;
        });
    }
}
export const databaseEntry = new DatabaseEntry();
