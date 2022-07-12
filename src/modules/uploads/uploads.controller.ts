import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetCurrentUser } from '../../common/decorators';
import { AuthenticatedGuard } from '../../common/guards';
import { User } from '../users/entities/user.entity';
import { UploadsService } from './uploads.service';
import { editFileName, imageFileFilter } from './utils/file-helper';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsSerivce: UploadsService) {}

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post('users')
  uploadUserPhoto(
    @GetCurrentUser() user: User,
    @UploadedFile() file,
  ): Promise<{ photo: string }> {
    return this.uploadsSerivce.uploadUserPhoto(user.id, file.filename);
  }

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post('boards/:id')
  uploadBoardPhoto(
    @Param('id') id: string,
    @GetCurrentUser() user: User,
    @UploadedFile() file,
  ): Promise<{ photo: string }> {
    return this.uploadsSerivce.uploadBoardPhoto(
      id,
      user.id,
      `/${file.filename}`,
    );
  }
}
