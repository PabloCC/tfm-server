import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'changeme',
  database: process.env.DATABASE_NAME || 'tfmserver',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  extra: {
    ssl: { rejectUnauthorized: false },
  },
  synchronize: true,
};
