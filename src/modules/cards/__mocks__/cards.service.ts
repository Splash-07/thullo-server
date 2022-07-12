import { cardStub, cardStubTwo } from '../tests/stubs/card.stub';

export const CardsService = jest.fn().mockReturnValue({
  createCard: jest.fn().mockResolvedValue(cardStub()),
  updateCard: jest
    .fn()
    .mockResolvedValue({ ...cardStub(), title: 'new title' }),
  updateCardPosition: jest.fn().mockResolvedValue({
    UpdatedMovedCard: { id: cardStubTwo().id, position: cardStub().position },
    UpdatedPositionCard: {
      id: cardStub().id,
      position: cardStubTwo().position,
    },
  }),
  getCard: jest.fn().mockResolvedValue(cardStub()),
  deleteCard: jest.fn().mockResolvedValue({ message: 'Deleted card' }),
  changeCardList: jest.fn().mockResolvedValue(cardStub()),
});
