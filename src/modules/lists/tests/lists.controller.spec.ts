import { Test, TestingModule } from '@nestjs/testing';
import { boardStub } from '../../boards/tests/stubs/board.stub';
import { CreateListDto, UpdateListDto } from '../dtos';
import { List } from '../entities/list.entity';
import { ListsController } from '../lists.controller';
import { ListsService } from '../lists.service';
import { listStub, listStubTwo } from './stubs/list.stub';

jest.mock('../lists.service');

describe('ListsController', () => {
  let listsController: ListsController;
  let listsService: ListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ListsController],
      providers: [ListsService],
    }).compile();

    listsController = module.get<ListsController>(ListsController);
    listsService = module.get<ListsService>(ListsService);
  });

  describe('createList', () => {
    describe('when createList is called', () => {
      let createListDto: CreateListDto;
      let list: List;

      beforeEach(async () => {
        createListDto = {
          title: listStub().title,
        };

        list = await listsController.createList(createListDto, boardStub().id);
      });
      test('then it should call listsService', () => {
        expect(listsService.createList).toHaveBeenCalledWith(
          boardStub().id,
          createListDto,
        );
      });
      test('then it should return the created list', () => {
        expect(list).toEqual(listStub());
      });
    });
  });
  describe('updateList', () => {
    describe('when updateList is called', () => {
      let updateListDto: UpdateListDto;
      let list: List;

      beforeEach(async () => {
        updateListDto = {
          title: 'testnew',
        };

        list = await listsController.updateList(updateListDto, listStub().id);
      });

      test('then it should call listsService', () => {
        expect(listsService.updateList).toHaveBeenCalledWith(
          listStub().id,
          updateListDto,
        );
      });

      test('then it should return updated list', () => {
        expect(list).toEqual({ ...listStub(), title: 'testnew' });
      });
    });
  });
  describe('updateListPosition', () => {
    describe('when updateListPosition is called', () => {
      let listPositions;
      beforeEach(async () => {
        listPositions = await listsController.updateListPosition(
          listStub().id,
          listStubTwo().id,
        );
      });

      test('then it should call listsService', () => {
        expect(listsService.updateListPosition).toHaveBeenCalledWith(
          listStub().id,
          listStubTwo().id,
        );
      });

      test('then it should return updated list positions and id', () => {
        expect(listPositions).toEqual({
          UpdatedMovedList: {
            id: listStub().id,
            position: listStubTwo().position,
          },
          UpdatedPositionList: {
            id: listStubTwo().id,
            position: listStub().position,
          },
        });
      });
    });
  });
  describe('getLists', () => {
    describe('when getLists is called', () => {
      let lists: List[];
      beforeEach(async () => {
        lists = await listsController.getLists(boardStub().id);
      });

      test('then it should call listsService', () => {
        expect(listsService.getLists).toHaveBeenCalledWith(boardStub().id);
      });

      test('then it should return lists', () => {
        expect(lists).toEqual([listStub()]);
      });
    });
  });

  describe('deleteList', () => {
    describe('when deleteList is called', () => {
      let message;
      beforeEach(async () => {
        message = await listsController.deleteList(
          listStub().id,
          boardStub().id,
        );
      });

      test('then it should call listsService', () => {
        expect(listsService.deleteList).toHaveBeenCalledWith(
          listStub().id,
          boardStub().id,
        );
      });

      test('then it should return message', () => {
        expect(message).toEqual({ message: 'Deleted list' });
      });
    });
  });
});
