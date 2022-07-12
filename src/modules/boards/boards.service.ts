import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from './dtos';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async createBoard(dto: CreateBoardDto, userId: string): Promise<Board> {
    const board = this.boardRepository.create({
      ...dto,
      userId,
    });
    await this.boardRepository.save(board);

    return board;
  }

  async updateBoard(id, dto: UpdateBoardDto, userId: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id, userId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    board.title = dto.title ? dto.title : board.title;
    board.background = dto.background ? dto.background : board.background;

    await this.boardRepository.save(board);

    return board;
  }

  async getBoards(id: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { userId: id },
    });
  }

  async getBoard(id: string, userId: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id, userId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async deleteBoard(id: string, userId: string): Promise<{ message: string }> {
    const board = await this.boardRepository.findOne({
      where: { id, userId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.boardRepository.delete({ id, userId });

    return { message: 'Board deleted' };
  }
}
