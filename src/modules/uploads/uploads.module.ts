import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BoardsModule } from '../boards/boards.module';
import { UsersModule } from '../users/users.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    UsersModule,
    BoardsModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
