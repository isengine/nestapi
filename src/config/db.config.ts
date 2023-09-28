import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDbConfig = async (
  config: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: config.get<any>('DB_TYPE'),
  host: config.get<string>('DB_HOST'),
  database: config.get<string>('DB_NAME'),
  username: config.get<string>('DB_USER'),
  password: config.get<string>('DB_PASSWORD'),
  port: config.get<number>('DB_PORT'),

  synchronize: true,
  autoLoadEntities: true,
  logging: true,

  // entities: ['/src/**/*.entity{.ts,.js}'],
  entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrations: [__dirname + 'src/typeorm/migrations/*.ts'],
  // dist/mig/*.js
  // dir = src/mig
  // run = false

  // "typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js",
  // "migration:create": "npm run build && npm run typeorm migration:create -- -n",
  // "migration:generate": "npm run build && npm run typeorm migration:generate -- -n",
  // "migration:run": "npm run build && npm run typeorm migration:run",
  // "migration:revert": "npm run typeorm migration:revert"
});
