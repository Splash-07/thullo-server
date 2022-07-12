import { listStub, listStubTwo } from '../tests/stubs/list.stub';

export const ListsService = jest.fn().mockReturnValue({
  createList: jest.fn().mockResolvedValue(listStub()),
  updateList: jest.fn().mockResolvedValue({ ...listStub(), title: 'testnew' }),
  updateListPosition: jest.fn().mockResolvedValue({
    UpdatedMovedList: { id: listStub().id, position: listStubTwo().position },
    UpdatedPositionList: {
      id: listStubTwo().id,
      position: listStub().position,
    },
  }),
  getLists: jest.fn().mockResolvedValue([listStub()]),
  deleteList: jest.fn().mockResolvedValue({ message: 'Deleted list' }),
});
