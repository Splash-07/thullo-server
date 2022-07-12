import { boardStub } from '../tests/stubs/board.stub';

export const BoardsService = jest.fn().mockReturnValue({
  createBoard: jest.fn().mockResolvedValue(boardStub()),
  updateBoard: jest
    .fn()
    .mockResolvedValue({ ...boardStub(), title: 'testnew' }),
  getBoards: jest.fn().mockResolvedValue([boardStub()]),
  getBoard: jest.fn().mockResolvedValue(boardStub()),
  deleteBoard: jest.fn().mockResolvedValue({ message: 'Board deleted' }),
});
