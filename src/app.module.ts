import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDbConfig } from '@config/db.config';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { NogqlModule } from '@src/common/module/nogql.module';
import { AuthModule } from '@src/auth/auth.module';
import { AuthConfirmModule } from '@src/auth/auth_confirm/auth_confirm.module';
import { AuthSessionsModule } from '@src/auth/auth_sessions/auth_sessions.module';
import { AuthStrategiesModule } from '@src/auth/auth_strategies/auth_strategies.module';
import { ClientsModule } from '@src/clients/clients.module';
import { ClientsRedirectsModule } from '@src/clients/clients_redirects/clients_redirects.module';
import { FilesModule } from '@src/files/files.module';
import { MailModule } from '@src/mail/mail.module';
import { RandomModule } from '@src/random/random.module';
import { TokenModule } from '@src/token/token.module';

import { PersonsModule } from './db/persons/persons.module';
import { PostsModule } from './db/posts/posts.module';
import { PostsCategoriesModule } from './db/posts/posts_categories/posts_categories.module';
import { PostsTagsModule } from './db/posts/posts_tags/posts_tags.module';
import { SettingsModule } from './db/settings/settings.module';
import { SettingsGroupsModule } from './db/settings/settings_groups/settings_groups.module';
import { TestModule } from './db/test/test.module';
import { UsersModule } from './db/users/users.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDbConfig,
    }),
    process.env.GQL_ENABLE
      ? GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: 'schema.gql',
          sortSchema: true,
          playground: !!process.env.GQL_PLAYGROUND,
        })
      : NogqlModule,
    PassportModule.register({ session: true }),
    AuthModule,
    AuthConfirmModule,
    AuthSessionsModule,
    AuthStrategiesModule,
    ClientsModule,
    ClientsRedirectsModule,
    FilesModule,
    MailModule,
    RandomModule,
    TokenModule,

    PersonsModule,
    PostsModule,
    PostsCategoriesModule,
    PostsTagsModule,
    SettingsModule,
    SettingsGroupsModule,
    TestModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
