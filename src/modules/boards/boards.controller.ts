import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../../common/decorators';
import { AuthenticatedGuard } from '../../common/guards';
import { User } from '../users/entities/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto } from './dtos';
import { Board } from './entities/board.entity';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  createBoard(
    @Body() dto: CreateBoardDto,
    @GetCurrentUser() user: User,
  ): Promise<Board> {
    return this.boardsService.createBoard(dto, user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/:id')
  updateBoard(
    @Param('id') id: string,
    @Body() dto: UpdateBoardDto,
    @GetCurrentUser() user: User,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, dto, user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  getBoards(@GetCurrentUser() user: User): Promise<Board[]> {
    return this.boardsService.getBoards(user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/:id')
  getBoard(
    @Param('id') id: string,
    @GetCurrentUser() user: User,
  ): Promise<Board> {
    return this.boardsService.getBoard(id, user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  deleteBoard(
    @Param('id') id: string,
    @GetCurrentUser() user: User,
  ): Promise<{ message: string }> {
    return this.boardsService.deleteBoard(id, user.id);
  }
}
