import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDbConfig } from '@config/db.config';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { NogqlModule } from '@src/typeorm/module/nogql.module';
import { AuthModule } from '@src/auth/auth.module';
import { AuthConfirmModule } from '@src/auth_confirm/auth_confirm.module';
import { AuthSessionsModule } from '@src/auth_sessions/auth_sessions.module';
import { ClientsModule } from '@src/clients/clients.module';
import { ClientsRedirectsModule } from '@src/clients_redirects/clients_redirects.module';
import { FilesModule } from '@src/files/files.module';
import { FormsModule } from '@src/forms/forms.module';
import { MailModule } from '@src/mail/mail.module';
import { PersonsModule } from '@src/persons/persons.module';
import { PostsModule } from '@src/posts/posts.module';
import { PostsCategoriesModule } from '@src/posts_categories/posts_categories.module';
import { PostsTagsModule } from '@src/posts_tags/posts_tags.module';
import { RandomModule } from '@src/random/random.module';
import { RolesModule } from '@src/roles/roles.module';
import { RoomsModule } from '@src/rooms/rooms.module';
import { SettingsModule } from '@src/settings/settings.module';
import { SettingsGroupsModule } from '@src/settings_groups/settings_groups.module';
import { SocketsModule } from '@src/sockets/sockets.module';
import { StrategiesModule } from '@src/strategies/strategies.module';
import { TokenModule } from '@src/token/token.module';
import { TokenGrantsModule } from '@src/token_grants/token_grants.module';
import { UsersModule } from '@src/users/users.module';

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
    ClientsModule,
    ClientsRedirectsModule,
    FilesModule,
    FormsModule,
    MailModule,
    PersonsModule,
    PostsModule,
    PostsCategoriesModule,
    PostsTagsModule,
    RandomModule,
    RolesModule,
    RoomsModule,
    SettingsModule,
    SettingsGroupsModule,
    SocketsModule,
    StrategiesModule,
    TokenModule,
    TokenGrantsModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
