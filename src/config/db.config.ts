import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

type DatabaseTypes =
  | 'mysql'
  | 'postgres'
  | 'sqlite'
  | 'mssql'
  | 'oracle'
  | 'mongodb';

export const getDbConfig = async (
  config: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: config.get<DatabaseTypes>('DB_TYPE'),
  host: config.get<string>('DB_HOST'),
  database: config.get<string>('DB_NAME'),
  schema: config.get<string>('DB_SCHEMA'),
  username: config.get<string>('DB_USER'),
  password: config.get<string>('DB_PASSWORD'),
  port: config.get<number>('DB_PORT'),

  synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
  autoLoadEntities: true,
  logging: config.get<string>('DB_LOG') === 'true',

  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../typeorm/migrations/*.ts')],
  migrationsTableName: 'migrations_typeorm',
});
