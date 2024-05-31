
import { DataSource, Entity, PrimaryGeneratedColumn, In } from 'typeorm';
import { CrawlRecord } from './CrawlRecord.js';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: [CrawlRecord],
    synchronize: true,
    logging: true,
});

AppDataSource.initialize()
    .catch((error: Error) => console.log(error))



class DatabaseEntry {
    async saveCrawlRecord(record: CrawlRecord): Promise<string> {
        var allRecords: CrawlRecord[] = [];
        var allFoundUrls: any = [];
        var queue: CrawlRecord[] = [];
        queue.push(record);
        while (queue.length > 0) {
            const next = queue.shift();
            if (next) {
                if (allFoundUrls[next.url!]) {
                    continue;
                }
                allFoundUrls[next.url!] = next;
                allRecords.push(next);

                await AppDataSource.getRepository(CrawlRecord).save(next);

                for (const child of next.matchLinksRecord) {
                    if (!allFoundUrls[child.url!]) {
                        queue.push(child);
                    }
                }

            }
        }

        for(const record of allRecords){
            for(const child of record.matchLinksRecord){
                record.matchLinksRecordIds.push(child.id!);
            }
            await AppDataSource.getRepository(CrawlRecord).update(record.id!, {matchLinksRecordIds: record.matchLinksRecordIds});
        }

        return record!.id!;
    }
    
    async removeCrawlRecord(id: string): Promise < boolean > {
            const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);

            const record = await crawlRecordRepository.findOneBy({ id });
            if(!record) {
                return false;
            }

        var allFoundUrls: any =[];
            var queue: CrawlRecord[] = [];
            queue.push(record);
            while(queue.length > 0) {
            const next = queue.shift();
            if (next) {
                if (allFoundUrls[next.id!]) {
                    continue;
                }
                allFoundUrls[next.id!] = next;

                for (const childId of next.matchLinksRecordIds) {
                    if (!allFoundUrls[childId]) {
                        const child = await crawlRecordRepository.findOneBy({ id: childId });
                        if (child) {
                            queue.push(child);
                        }
                    }
                }
                AppDataSource.getRepository(CrawlRecord).remove(next);
            }
        }
        return true;
    }

    async updateCrawlRecord(record: CrawlRecord): Promise<boolean> {
        const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);
        const updateResult = await crawlRecordRepository.save(record);
        return !!updateResult;
    }

    async getCrawlRecord(id: string): Promise<CrawlRecord | null> {

        const crawlRecordRepository = AppDataSource.getRepository(CrawlRecord);

        // Load the top-level record
        const record = await crawlRecordRepository.findOne({
            where: { id },
        });

        if (record) {
            // a dicitionary of ids to records
            var allFoundUrls: any = [];
            var queue: CrawlRecord[] = [];
            queue.push(record);
            while (queue.length > 0) {
                const next = queue.shift();
                if (next) {
                    if (!next.matchLinksRecordIds) {
                        continue;
                    }

                    if (allFoundUrls[next.id!]) {
                        continue;
                    }
                    allFoundUrls[next.id!] = next;

                    for (const childId of next.matchLinksRecordIds) {
                        if (allFoundUrls[childId]) {

                            if (!next.matchLinksRecord) {
                                next.matchLinksRecord = [];
                            }
                            next.matchLinksRecord.push(allFoundUrls[childId]);

                        } else (allFoundUrls[childId])
                        {

                            const child = await crawlRecordRepository.findOneBy({ id: childId });
                            if (child) {
                                queue.push(child);
                                if(!next.matchLinksRecord){
                                    next.matchLinksRecord = [];
                                }
                                next.matchLinksRecord.push(child);
                            }
                        }
                    }
                }
            }
        }

        return record || null;
    }
}

export const databaseEntry = new DatabaseEntry();
