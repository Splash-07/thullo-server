import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { boardStub } from '../../boards/tests/stubs/board.stub';
import { Repository } from 'typeorm';
import { CreateListDto, UpdateListDto } from '../dtos';
import { List } from '../entities/list.entity';
import { ListsService } from '../lists.service';
import { listStub, listStubTwo } from './stubs/list.stub';

describe('ListsService', () => {
  let service: ListsService;
  let listsRepository: Repository<List>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListsService,
        {
          provide: getRepositoryToken(List),
          useValue: {
            findOne: jest.fn().mockImplementation(() => listStub()),
            create: jest.fn().mockImplementation((dto) => dto),
            find: jest.fn().mockImplementation(() => []),
            save: jest.fn().mockImplementation((dto) => dto),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ListsService>(ListsService);
    listsRepository = module.get<Repository<List>>(getRepositoryToken(List));
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('listsRepository is defined', () => {
    expect(listsRepository).toBeDefined();
  });

  describe('createList', () => {
    describe('when createList is called', () => {
      let createListDto: CreateListDto;
      let result: List;
      beforeEach(async () => {
        createListDto = {
          title: 'test',
        };

        result = await service.createList(boardStub().id, createListDto);
      });

      test('then it should call find and save', async () => {
        expect(listsRepository.find).toHaveBeenCalled();

        expect(listsRepository.save).toHaveBeenCalledWith(result);
      });
      test('then it should return a list', () => {
        expect(result.boardId).toEqual(listStub().boardId);
        expect(result.title).toEqual(listStub().title);
        expect(result.position).toEqual(listStub().position);
      });
    });
  });
  describe('updateList', () => {
    describe('when updateList is called', () => {
      let updateListDto: UpdateListDto;
      let result: List;
      beforeEach(async () => {
        updateListDto = {
          title: 'newtest',
        };

        result = await service.updateList(listStub().id, updateListDto);
      });

      test('then it should call findOne and save', async () => {
        expect(listsRepository.findOne).toHaveBeenCalled();

        expect(listsRepository.save).toHaveBeenCalledWith(result);
      });
      test('then it should return a list', () => {
        expect(result).toEqual({ ...listStub(), title: 'newtest' });
      });
    });
  });
  describe('updateListPosition', () => {
    describe('when updateListPosition is called', () => {
      let result: any;
      beforeEach(async () => {
        result = await service.updateListPosition(
          listStub().id,
          listStubTwo().id,
        );
      });

      test('then it should call findOne and save twice', async () => {
        expect(listsRepository.findOne).toHaveBeenCalledTimes(2);

        expect(listsRepository.save).toHaveBeenCalledTimes(2);
      });
      test('then it should return a list', () => {
        expect(result).toEqual({
          UpdatedMovedList: {
            id: listStub().id,
            position: 0,
          },
          UpdatedPositionList: {
            id: listStub().id,
            position: 0,
          },
        });
      });
    });
  });
  describe('getLists', () => {
    describe('when getLists is called', () => {
      let result: List[];
      beforeEach(async () => {
        jest
          .spyOn(listsRepository, 'find')
          .mockImplementation(async () => [listStub()]);
        result = await service.getLists(boardStub().id);
      });

      test('then it should call find', async () => {
        expect(listsRepository.find).toHaveBeenCalled();
      });
      test('then it should return a list', () => {
        expect(result).toEqual([listStub()]);
      });
    });
  });
  describe('deleteList', () => {
    describe('when deleteList is called', () => {
      let result: any;
      beforeEach(async () => {
        result = await service.deleteList(listStub().id, boardStub().id);
      });

      test('then it should call findOne', async () => {
        expect(listsRepository.findOne).toHaveBeenCalled();
        expect(listsRepository.remove).toHaveBeenCalled();
        expect(listsRepository.find).toHaveBeenCalled();
      });
      test('then it should return a message object', () => {
        expect(result).toEqual({ message: 'Deleted list' });
      });
    });
  });
});
