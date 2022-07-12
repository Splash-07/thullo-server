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
import { AuthenticatedGuard } from '../../common/guards';
import { CreateListDto, UpdateListDto } from './dtos';
import { List } from './entities/list.entity';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsController {
  constructor(private readonly listService: ListsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post(':boardId')
  createList(
    @Body() dto: CreateListDto,
    @Param('boardId') boardId: string,
  ): Promise<List> {
    return this.listService.createList(boardId, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/:listId')
  updateList(
    @Body() dto: UpdateListDto,
    @Param('listId') listId: string,
  ): Promise<List> {
    return this.listService.updateList(listId, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/position/:listId/:positionListId')
  updateListPosition(
    @Param('listId') listId: string,
    @Param('positionListId') positionListId: string,
  ): Promise<{
    UpdatedMovedList: { id: string; position: number };
    UpdatedPositionList: {
      id: string;
      position: number;
    };
  }> {
    return this.listService.updateListPosition(listId, positionListId);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/move/:listId/:index')
  moveList(@Param('listId') listId: string, @Param('index') index: number) {
    return this.listService.moveList(listId, index);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':boardId')
  getLists(@Param('boardId') boardId: string): Promise<List[]> {
    return this.listService.getLists(boardId);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':listId/boards/:boardId')
  deleteList(
    @Param('listId') listId: string,
    @Param('boardId') boardId: string,
  ): Promise<{ message: string }> {
    return this.listService.deleteList(listId, boardId);
  }
}
