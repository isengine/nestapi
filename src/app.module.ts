import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';

import { getAppConfig } from '@config/app.config';
import { getDbConfig } from '@config/db.config';

// import { ConfirmModule } from '@src/confirm/confirm.module';
// import { SessionModule } from '@src/session/session.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@src/auth/auth.module';
import { CategoriesModule } from '@src/categories/categories.module';
import { PostsModule } from '@src/posts/posts.module';
import { TagsModule } from '@src/tags/tags.module';
import { UsersModule } from '@src/users/users.module';
import { NogqlModule } from '@src/typeorm/module/nogql.module';
import { FilesModule } from '@src/files/files.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      load: [getAppConfig],
    }),
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
    PostsModule,
    TagsModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
