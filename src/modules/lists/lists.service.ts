import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListDto, UpdateListDto } from './dtos';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listsRepository: Repository<List>,
  ) {}

  async createList(boardId: string, dto: CreateListDto): Promise<List> {
    const lists = await this.listsRepository.find({ boardId });
    const list = new List();

    list.boardId = boardId;
    list.title = dto.title;

    if (lists.length === 0) {
      list.position = 0;
    } else if (lists.length === 1) {
      list.position = 1;
    } else {
      list.position = lists[lists.length - 1].position + 1;
    }

    await this.listsRepository.save(list);

    return list;
  }

  async updateList(listId: string, dto: UpdateListDto): Promise<List> {
    const list = await this.listsRepository.findOne({ id: listId });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    list.title = dto.title;

    await this.listsRepository.save(list);

    return list;
  }

  async updateListPosition(
    listId: string,
    positionListId: string,
  ): Promise<{
    UpdatedMovedList: { id: string; position: number };
    UpdatedPositionList: {
      id: string;
      position: number;
    };
  }> {
    const list = await this.listsRepository.findOne({ id: listId });
    const positionList = await this.listsRepository.findOne({
      id: positionListId,
    });

    if (!list || !positionList) {
      throw new NotFoundException('List not found');
    }
    const listPosition = list.position;
    const positionListPosition = positionList.position;

    list.position = positionListPosition;

    positionList.position = listPosition;

    await this.listsRepository.save(list);
    await this.listsRepository.save(positionList);

    return {
      UpdatedMovedList: { id: list.id, position: list.position },
      UpdatedPositionList: {
        id: positionList.id,
        position: positionList.position,
      },
    };
  }

  async moveList(listId: string, index: number) {
    const list = await this.listsRepository.findOne({ id: listId });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    const lists = await (
      await this.listsRepository.find({ boardId: list.boardId })
    ).sort((a, b) => a.position - b.position);

    const pulledList = lists.splice(list.position, 1);
    lists.splice(index, 0, pulledList[0]);

    for (let i = 0; i < lists.length; i++) {
      lists[i].position = i;
      await this.listsRepository.save(lists[i]);
    }
  }

  async getLists(boardId: string): Promise<List[]> {
    const lists = await this.listsRepository.find({
      relations: ['cards'],
      where: { boardId },
      order: {
        position: 'ASC',
      },
    });

    return lists.map((list) => {
      list.cards = list.cards.sort((a, b) => a.position - b.position);
      return list;
    });
  }

  async deleteList(
    listId: string,
    boardId: string,
  ): Promise<{ message: string }> {
    const list = await this.listsRepository.findOne({ id: listId });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    await this.listsRepository.remove(list);

    let lists = await this.listsRepository.find({ boardId });

    lists = lists.sort((a, b) => a.position - b.position);

    if (lists.length === 0) {
      return { message: 'Deleted list' };
    }

    for (let i = 0; i < lists.length; i++) {
      lists[i].position = i;
      await this.listsRepository.save(lists[i]);
    }

    return { message: 'Deleted list' };
  }
}
