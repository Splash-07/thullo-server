import { List } from '../../entities/list.entity';

export const listStub = () => {
  const listStub = new List();

  listStub.boardId = '123456';
  listStub.title = 'test';
  listStub.id = '123456';
  listStub.createdAt = new Date('2020-01-01');
  listStub.updatedAt = new Date('2020-01-01');
  listStub.position = 0;
  listStub.cards = [];
  return listStub;
};

export const listStubTwo = () => {
  const listStub = new List();

  listStub.boardId = '1234567';
  listStub.title = 'test-two';
  listStub.id = '1234568';
  listStub.createdAt = new Date('2020-01-01');
  listStub.updatedAt = new Date('2020-01-01');
  listStub.position = 1;

  return listStub;
};
