import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { List } from '../../lists/entities/list.entity';
import { listStub } from '../../lists/tests/stubs/list.stub';
import { Repository } from 'typeorm';
import { CardsService } from '../cards.service';
import { Card } from '../entities/card.entity';
import { cardStub } from './stubs/card.stub';
import { CreateCardDto, UpdateCardDto } from '../dtos';

describe('CardsService', () => {
  let service: CardsService;
  let cardsRepository: Repository<Card>;
  let listsRepository: Repository<List>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(Card),
          useValue: {
            findOne: jest.fn().mockImplementation(() => cardStub()),
            find: jest.fn().mockImplementation(() => [cardStub()]),
            save: jest.fn().mockImplementation(() => cardStub()),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(List),
          useValue: {
            findOne: jest.fn().mockImplementation(() => listStub()),
          },
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    cardsRepository = module.get<Repository<Card>>(getRepositoryToken(Card));
    listsRepository = module.get<Repository<List>>(getRepositoryToken(List));
  });

  test('service should be defined', () => {
    expect(service).toBeDefined();
  });

  test('repository is defined', () => {
    expect(cardsRepository).toBeDefined();
    expect(listsRepository).toBeDefined();
  });

  describe('createCard', () => {
    describe('when createCard is called', () => {
      let createCardDto: CreateCardDto;
      let result: Card;
      beforeEach(async () => {
        createCardDto = {
          title: cardStub().title,
          description: cardStub().description,
        };

        result = await service.createCard(createCardDto, listStub().id);
      });

      test('then it should call find, findOne and save', async () => {
        expect(cardsRepository.find).toHaveBeenCalled();
        expect(listsRepository.findOne).toHaveBeenCalled();

        expect(cardsRepository.save).toHaveBeenCalledWith(result);
      });
    });
  });
  describe('updateCard', () => {
    describe('when updateCard is called', () => {
      let updateCardDto: UpdateCardDto;
      let result: Card;
      beforeEach(async () => {
        updateCardDto = {
          title: 'changed title',
          description: cardStub().description,
        };

        result = await service.updateCard(updateCardDto, cardStub().id);
      });

      test('then it should call find and save', async () => {
        expect(cardsRepository.findOne).toHaveBeenCalled();
        expect(cardsRepository.save).toHaveBeenCalledWith(result);
      });
      test('then it should return a card', () => {
        expect(result).toEqual({ ...cardStub(), title: 'changed title' });
      });
    });
  });
  describe('updateCardPosition', () => {
    describe('when updateCardPosition is called', () => {
      let result: {
        UpdatedMovedCard: { id: string; position: number };
        UpdatedPositionCard: {
          id: string;
          position: number;
        };
      };
      beforeEach(async () => {
        result = await service.updateCardPosition(cardStub().id, cardStub().id);
      });

      test('then it should call findOne and save', async () => {
        expect(cardsRepository.findOne).toHaveBeenCalledTimes(2);
        expect(cardsRepository.save).toHaveBeenCalledTimes(2);
      });
      test('then it should return a card', () => {
        expect(result).toEqual({
          UpdatedMovedCard: {
            id: cardStub().id,
            position: cardStub().position,
          },
          UpdatedPositionCard: {
            id: cardStub().id,
            position: cardStub().position,
          },
        });
      });
    });
  });
  describe('changeCardList', () => {
    describe('when changeCardList is called', () => {
      let result: Card;
      beforeEach(async () => {
        result = await service.changeCardList(cardStub().id, listStub().id);
      });

      test('then it should call findOne and save', async () => {
        expect(cardsRepository.findOne).toHaveBeenCalled();
        expect(listsRepository.findOne).toHaveBeenCalled();
        expect(cardsRepository.save).toHaveBeenCalled();
      });
      test('then it should return a card', () => {
        expect(result).toEqual(cardStub());
      });
    });
  });
  describe('getCard', () => {
    describe('when getCard is called', () => {
      let result: Card;
      beforeEach(async () => {
        result = await service.getCard(cardStub().id);
      });

      test('then it should call findOne', async () => {
        expect(cardsRepository.findOne).toHaveBeenCalled();
      });
      test('then it should return a card', () => {
        expect(result).toEqual(cardStub());
      });
    });
  });
  describe('deleteCard', () => {
    describe('when deleteCard is called', () => {
      let result: { message: string };
      beforeEach(async () => {
        jest
          .spyOn(listsRepository, 'findOne')
          .mockImplementation(async () => listStub());
        result = await service.deleteCard(cardStub().id, listStub().id);
      });

      test('then it should call findOne and remove', async () => {
        expect(cardsRepository.findOne).toHaveBeenCalledWith({
          id: cardStub().id,
        });
        expect(cardsRepository.remove).toHaveBeenCalledWith(cardStub());

        expect(listsRepository.findOne).toHaveBeenCalled();
      });
      test('then it should return a card', () => {
        expect(result).toEqual({ message: 'Deleted card' });
      });
    });
  });
});
