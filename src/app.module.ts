import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getDbConfig } from '@config/db.config';

import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';

import { AuthModule } from '@src/auth/auth.module';
import { CategoriesModule } from '@src/categories/categories.module';
// import { ConfirmModule } from '@src/confirm/confirm.module';
import { FilesModule } from '@src/files/files.module';
import { MailModule } from '@src/mail/mail.module';
import { PostsModule } from '@src/posts/posts.module';
// import { SessionModule } from '@src/session/session.module';
import { TagsModule } from '@src/tags/tags.module';
import { UsersModule } from '@src/users/users.module';

import { NogqlModule } from '@src/typeorm/module/nogql.module';

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
    CategoriesModule,
    FilesModule,
    MailModule,
    PostsModule,
    TagsModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
