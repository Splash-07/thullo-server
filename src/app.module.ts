import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BoardsModule } from './modules/boards/boards.module';
import { ListsModule } from './modules/lists/lists.module';
import { CardsModule } from './modules/cards/cards.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { User } from './modules/users/entities/user.entity';
import { Board } from './modules/boards/entities/board.entity';
import { Card } from './modules/cards/entities/card.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { List } from './modules/lists/entities/list.entity';
import { Session } from './modules/auth/entities/session.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend', 'build'),
    }),
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DEV_DB_HOST,
      port: Number(process.env.DEV_DB_PORT),
      username: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: process.env.DEV_DB_NAME,
      entities: [User, Board, Card, Comment, List, Session],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    UploadsModule,
    BoardsModule,
    ListsModule,
    CardsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
