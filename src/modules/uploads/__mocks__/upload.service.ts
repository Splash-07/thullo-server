import { userStub } from '../../users/tests/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  uploadUserPhoto: jest.fn().mockResolvedValue({ photo: userStub().photo }),
});
