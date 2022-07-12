import { Test } from '@nestjs/testing';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';

jest.mock('../users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    describe('when register is called', () => {
      let createUserDto: CreateUserDto;
      let msg: { message: string };
      beforeEach(async () => {
        createUserDto = {
          email: userStub().email,
          password: userStub().password,
        };
        msg = await usersController.register(createUserDto);
      });

      test('then it should call usersService', () => {
        expect(usersService.register).toHaveBeenCalledWith(createUserDto);
      });

      test('then it should return "User created successfully"', () => {
        expect(msg.message).toEqual('User created successfully');
      });
    });
  });

  describe('login', () => {
    describe('when login is called', () => {
      let loginUserDto: LoginUserDto;
      let user: User;

      beforeEach(async () => {
        loginUserDto = {
          email: userStub().email,
          password: userStub().password,
        };
        user = await usersController.login(loginUserDto);
      });
      test('then it should call usersService', () => {
        expect(usersService.login).toHaveBeenCalledWith(loginUserDto);
      });

      test('then it should return user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('getUser', () => {
    describe('when getUser is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await usersController.getUser(userStub());
      });

      test('then it should call usersService', () => {
        expect(usersService.getUser).toHaveBeenCalled();
      });

      test('then it should return user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      let user: User;
      let updateUserDto: UpdateUserDto;

      beforeEach(async () => {
        updateUserDto = {
          email: 'testnew@test.com',
          photo: 'tst',
          password: userStub().password,
        };
        user = await usersController.updateUser(updateUserDto, userStub());
      });

      test('then it should call usersService', () => {
        expect(usersService.updateUser).toHaveBeenCalled();
      });

      test('then it should return user', () => {
        expect(user).toEqual({ ...userStub(), email: updateUserDto.email });
      });
    });
  });
});
