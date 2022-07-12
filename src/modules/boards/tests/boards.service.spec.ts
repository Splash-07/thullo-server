import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userStub } from '../../users/tests/stubs/user.stub';
import { Repository } from 'typeorm';
import { BoardsService } from '../boards.service';
import { Board } from '../entities/board.entity';
import { boardStub } from './stubs/board.stub';

describe('BoardsService', () => {
  let service: BoardsService;
  let boardRepository: Repository<Board>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: getRepositoryToken(Board),
          useValue: {
            findOne: jest.fn().mockImplementation(() => boardStub()),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn().mockImplementation((dto) => dto),
            find: jest.fn().mockImplementation(() => [boardStub()]),
          },
        },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
    boardRepository = module.get<Repository<Board>>(getRepositoryToken(Board));
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('boardRepository is defined', () => {
    expect(boardRepository).toBeDefined();
  });

  describe('createBoard', () => {
    describe('when createBoard is called', () => {
      beforeEach(async () => {
        jest
          .spyOn(boardRepository, 'create')
          .mockImplementation(() => boardStub());
      });

      test('then it should create a new board and return it', async () => {
        const result = await service.createBoard(boardStub(), userStub().id);

        expect(boardRepository.create).toHaveBeenCalledWith({
          ...boardStub(),
          userId: userStub().id,
        });
        expect(boardRepository.save).toHaveBeenCalledTimes(1);

        expect(result).toEqual(boardStub());
      });
    });
  });
  describe('updateBoard', () => {
    describe('when updateBoard is called', () => {
      test('then it should update the board and return it', async () => {
        const result = await service.updateBoard(
          boardStub().id,
          { ...boardStub(), title: 'new title' },
          userStub().id,
        );

        expect(boardRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: boardStub().id,
            userId: userStub().id,
          },
        });

        expect(boardRepository.save).toHaveBeenCalled();

        expect(result).toEqual({ ...boardStub(), title: 'new title' });
      });
    });
  });
  describe('getBoards', () => {
    describe('when getBoards is called', () => {
      test('then it should return all boards', async () => {
        const result = await service.getBoards(userStub().id);

        expect(boardRepository.find).toHaveBeenCalledWith({
          where: { userId: userStub().id },
        });

        expect(result).toEqual([boardStub()]);
      });
    });
  });
  describe('getBoard', () => {
    describe('when getBoard is called', () => {
      test('then it should return the board', async () => {
        const result = await service.getBoard(boardStub().id, userStub().id);

        expect(boardRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: boardStub().id,
            userId: userStub().id,
          },
        });

        expect(result).toEqual(boardStub());
      });
    });
  });
  describe('deleteBoard', () => {
    describe('when deleteBoard is called', () => {
      test('then it should delete the board', async () => {
        await service.deleteBoard(boardStub().id, userStub().id);

        expect(boardRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: boardStub().id,
            userId: userStub().id,
          },
        });

        expect(boardRepository.delete).toHaveBeenCalledWith({
          id: boardStub().id,
          userId: userStub().id,
        });
      });
    });
  });
});
