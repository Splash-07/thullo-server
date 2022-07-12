import { Test, TestingModule } from '@nestjs/testing';
import { listStub } from '../../lists/tests/stubs/list.stub';
import { CardsController } from '../cards.controller';
import { CardsService } from '../cards.service';
import { CreateCardDto, UpdateCardDto } from '../dtos';
import { Card } from '../entities/card.entity';
import { cardStub, cardStubTwo } from './stubs/card.stub';

jest.mock('../cards.service');

describe('CardsController', () => {
  let cardsController: CardsController;
  let cardsService: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CardsController],
      providers: [CardsService],
    }).compile();

    cardsController = module.get<CardsController>(CardsController);
    cardsService = module.get<CardsService>(CardsService);
  });

  describe('createCard', () => {
    describe('when createCard is called', () => {
      let createCardDto: CreateCardDto;
      let card: Card;

      beforeEach(async () => {
        createCardDto = {
          title: cardStub().title,
          description: cardStub().description,
        };

        card = await cardsController.createCard(
          cardStub().listId,
          createCardDto,
        );
      });

      test('then it should call cardsService', () => {
        expect(cardsService.createCard).toHaveBeenCalledWith(
          createCardDto,
          cardStub().listId,
        );
      });

      test('then it should return the card', () => {
        expect(card).toEqual(cardStub());
      });
    });
  });
  describe('updateCard', () => {
    describe('when updateCard is called', () => {
      let updateCardDto: UpdateCardDto;
      let card: Card;

      beforeEach(async () => {
        updateCardDto = {
          title: 'new title',
          description: cardStub().description,
        };

        card = await cardsController.updateCard(cardStub().id, updateCardDto);
      });

      test('then it should call cardsService', () => {
        expect(cardsService.updateCard).toHaveBeenCalledWith(
          updateCardDto,
          cardStub().id,
        );
      });

      test('then it should return the updated card', () => {
        expect(card).toEqual({ ...cardStub(), title: 'new title' });
      });
    });
  });
  describe('updateCardPosition', () => {
    describe('when updateCardPosition is called', () => {
      let body: any;

      beforeEach(async () => {
        body = await cardsController.updateCardPosition(
          cardStub().id,
          cardStubTwo().id,
        );
      });

      test('then it should call cardsService', () => {
        expect(cardsService.updateCardPosition).toHaveBeenCalledWith(
          cardStub().id,
          cardStubTwo().id,
        );
      });

      test('then it should return the updated card', () => {
        expect(body).toEqual({
          UpdatedMovedCard: {
            id: cardStubTwo().id,
            position: cardStub().position,
          },
          UpdatedPositionCard: {
            id: cardStub().id,
            position: cardStubTwo().position,
          },
        });
      });
    });
  });
  describe('changeCardList', () => {
    describe('when changeCardList is called', () => {
      let card: Card;

      beforeEach(async () => {
        card = await cardsController.changeCardList(
          cardStub().id,
          listStub().id,
        );
      });

      test('then it should call cardsService', () => {
        expect(cardsService.changeCardList).toHaveBeenCalledWith(
          cardStub().id,
          listStub().id,
        );
      });

      test('then it should return the updated card', () => {
        expect(card).toEqual(cardStub());
      });
    });
  });
  describe('getCard', () => {
    describe('when getCard is called', () => {
      let card: Card;

      beforeEach(async () => {
        card = await cardsController.getCard(cardStub().id);
      });

      test('then it should call cardsService', () => {
        expect(cardsService.getCard).toHaveBeenCalledWith(cardStub().id);
      });

      test('then it should return the card', () => {
        expect(card).toEqual(cardStub());
      });
    });
  });
  describe('deleteCard', () => {
    describe('when deleteCard is called', () => {
      let msg: { message: string };

      beforeEach(async () => {
        msg = await cardsController.DeleteCard(cardStub().id, listStub().id);
      });

      test('then it should call cardsService', () => {
        expect(cardsService.deleteCard).toHaveBeenCalledWith(
          cardStub().id,
          listStub().id,
        );
      });

      test('then it should return the card', () => {
        expect(msg).toEqual({ message: 'Deleted card' });
      });
    });
  });
});
