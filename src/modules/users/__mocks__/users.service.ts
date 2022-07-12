import { userStub } from '../tests/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  register: jest
    .fn()
    .mockResolvedValue({ message: 'User created successfully' }),
  login: jest.fn().mockResolvedValue(userStub()),
  getUser: jest.fn().mockResolvedValue(userStub()),
  deleteUser: jest
    .fn()
    .mockResolvedValue({ message: 'User deleted successfully' }),
  updateUser: jest
    .fn()
    .mockResolvedValue({ ...userStub(), email: 'testnew@test.com' }),
});
