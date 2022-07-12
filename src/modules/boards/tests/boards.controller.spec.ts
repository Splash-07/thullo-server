import { Test } from '@nestjs/testing';
import { userStub } from '../../users/tests/stubs/user.stub';
import { BoardsController } from '../boards.controller';
import { BoardsService } from '../boards.service';
import { CreateBoardDto, UpdateBoardDto } from '../dtos';
import { Board } from '../entities/board.entity';
import { boardStub } from './stubs/board.stub';

jest.mock('../boards.service');

describe('BoardsController', () => {
  let boardController: BoardsController;
  let boardService: BoardsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [BoardsController],
      providers: [BoardsService],
    }).compile();

    boardController = module.get<BoardsController>(BoardsController);
    boardService = module.get<BoardsService>(BoardsService);
    jest.clearAllMocks();
  });

  describe('createBoard', () => {
    describe('when createBoard is called', () => {
      let createBoardDto: CreateBoardDto;
      let board: Board;

      beforeEach(async () => {
        createBoardDto = {
          title: boardStub().title,
        };

        board = await boardController.createBoard(createBoardDto, userStub());
      });
      test('then it should call boardService', () => {
        expect(boardService.createBoard).toHaveBeenCalledWith(
          createBoardDto,
          userStub().id,
        );
      });

      test('then it should return board', () => {
        expect(board).toEqual(boardStub());
      });
    });
  });
  describe('updateBoard', () => {
    describe('when updateBoard is called', () => {
      let updateBoardDto: UpdateBoardDto;
      let board: Board;

      beforeEach(async () => {
        updateBoardDto = {
          title: 'testnew',
          background: 'testnew',
        };

        board = await boardController.updateBoard(
          boardStub().id,
          updateBoardDto,
          userStub(),
        );
      });

      test('then it should call boardService', () => {
        expect(boardService.updateBoard).toHaveBeenCalled();
      });

      test('then it should return updated board', () => {
        expect(board).toEqual({ ...boardStub(), title: 'testnew' });
      });
    });
  });
  describe('getBoards', () => {
    describe('when getBoards is called', () => {
      let boards: Board[];

      beforeEach(async () => {
        boards = await boardController.getBoards(userStub());
      });

      test('then it should call boardService', () => {
        expect(boardService.getBoards).toHaveBeenCalledWith(userStub().id);
      });

      test('then it should return boards', () => {
        expect(boards).toEqual([boardStub()]);
      });
    });
  });
  describe('getBoard', () => {
    describe('when getBoard is called', () => {
      let board: Board;

      beforeEach(async () => {
        board = await boardController.getBoard(boardStub().id, userStub());
      });

      test('then it should call boardService', () => {
        expect(boardService.getBoard).toHaveBeenCalledWith(
          boardStub().id,
          userStub().id,
        );
      });

      test('then it should return board', () => {
        expect(board).toEqual(boardStub());
      });
    });
  });
  describe('deleteBoard', () => {
    describe('when deleteBoard is called', () => {
      let message: { message: string };

      beforeEach(async () => {
        message = await boardController.deleteBoard(boardStub().id, userStub());
      });

      test('then it should call boardService', () => {
        expect(boardService.deleteBoard).toHaveBeenCalledWith(
          boardStub().id,
          userStub().id,
        );
      });

      test('then it should return message', () => {
        expect(message).toEqual({ message: 'Board deleted' });
      });
    });
  });
});
