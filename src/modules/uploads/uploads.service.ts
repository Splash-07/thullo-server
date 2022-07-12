import { Injectable } from '@nestjs/common';
import { BoardsService } from '../boards/boards.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class UploadsService {
  constructor(
    private usersService: UsersService,
    private boardService: BoardsService,
  ) {}
  async uploadUserPhoto(
    userId: string,
    photo: string,
  ): Promise<{ photo: string }> {
    const updatedPhoto = await this.usersService.updateUserPhoto(photo, userId);

    return { photo: updatedPhoto };
  }

  async uploadBoardPhoto(
    id: string,
    userId: string,
    photo: string,
  ): Promise<{ photo: string }> {
    const updatedPhoto = await this.boardService.updateBoard(
      id,
      { background: photo, title: null },
      userId,
    );

    return { photo: updatedPhoto.background };
  }
}
