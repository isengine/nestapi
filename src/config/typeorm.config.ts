import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

type DatabaseTypes =
  | 'mysql'
  | 'postgres'
  | 'sqlite'
  | 'mssql'
  | 'oracle'
  | 'mongodb';

const config = {
  type: process.env.DB_TYPE as DatabaseTypes,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),

  entities: [join(__dirname, '../../dist/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../../dist/typeorm/migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations_typeorm',
} as DataSourceOptions;

const AppDataSource = new DataSource(config);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((e) => {
    console.error('Error during Data Source initialization', e);
  });

export default AppDataSource;
