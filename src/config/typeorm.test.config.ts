import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmTestConfig: TypeOrmModuleOptions = {
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    logging: false
};
