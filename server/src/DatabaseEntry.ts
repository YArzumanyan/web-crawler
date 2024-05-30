
import { DataSource, Entity } from 'typeorm';
import { CrawlRecord } from './CrawlRecord.js';
import { PrimaryGeneratedColumn } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Entity()
class ExampleEntity {
    @PrimaryGeneratedColumn()
    id?: number;
}

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: [CrawlRecord],
    synchronize: true,
    logging: true,
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
    .catch((error) => console.log(error))


class DatabaseEntry {
    async saveCrawlRecord(record: CrawlRecord): Promise<number> {
        console.log('Saving record');
        const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
        const savedRecord = await crawlRecordRepository.save(record);
        return savedRecord.id!;
    }

    async removeCrawlRecord(id: number): Promise<boolean> {
        console.log('Removing record');
        const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
        const deleteResult = await crawlRecordRepository.delete(id);
        return deleteResult.affected !== 0;
    }

    async updateCrawlRecord(record: CrawlRecord): Promise<boolean> {
        console.log('Updating record');
        const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
        const updateResult = await crawlRecordRepository.save(record);
        return !!updateResult;
    }

    async getCrawlRecord(id: number): Promise<CrawlRecord | null> {
        console.log('Getting record');
        const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
        const record = await crawlRecordRepository.findOneBy({
            id: id
        });
        return record || null;
    }
}

export const databaseEntry = new DatabaseEntry();
