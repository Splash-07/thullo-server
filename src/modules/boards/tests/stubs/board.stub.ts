import { Board } from '../../entities/board.entity';

export const boardStub = () => {
  const boardStub = new Board();

  boardStub.title = 'test';
  boardStub.id = '123456';
  boardStub.createdAt = new Date('2020-01-01');
  boardStub.updatedAt = new Date('2020-01-01');

  return boardStub;
};
