import { Card } from '../../entities/card.entity';

export const cardStub = () => {
  const cardStub = new Card();

  cardStub.title = 'test';
  cardStub.description = 'testdesc';
  cardStub.listId = '123456';
  cardStub.id = '123456';
  cardStub.createdAt = new Date('2022-01-01');
  cardStub.updatedAt = new Date('2022-01-01');
  cardStub.position = 0;

  return cardStub;
};

export const cardStubTwo = () => {
  const cardStub = new Card();

  cardStub.title = 'testtwo';
  cardStub.description = 'testdesctwo';
  cardStub.listId = '123456';
  cardStub.id = '1234567';
  cardStub.createdAt = new Date('2022-01-01');
  cardStub.updatedAt = new Date('2022-01-01');
  cardStub.position = 0;

  return cardStub;
};
