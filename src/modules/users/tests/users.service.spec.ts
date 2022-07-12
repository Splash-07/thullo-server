import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn().mockImplementation((dto) => dto),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
  test('userRepository is defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('register', () => {
    describe('when register is called', () => {
      beforeEach(async () => {
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      });
      test('then it should create a new user and return "User created successfully"', async () => {
        const result = await service.register({
          email: userStub().email,
          password: userStub().password,
        });

        expect(userRepository.create).toHaveBeenCalledWith({
          email: userStub().email,
          password: 'hashedPassword',
        });
        expect(userRepository.save).toHaveBeenCalledTimes(1);

        expect(result).toEqual({ message: 'User created successfully' });
      });
    });
  });
  describe('login', () => {
    describe('when login is called', () => {
      beforeEach(() => {
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

        userRepository.findOne = jest
          .fn()
          .mockImplementation(async () => await userStub());
      });
      test('then it should find a user and return the user', async () => {
        const user = await service.login({
          email: userStub().email,
          password: userStub().password,
        });

        expect(userRepository.findOne).toHaveBeenCalledWith({
          email: userStub().email,
        });

        expect(user).toEqual(userStub());
      });
    });
  });
  describe('deleteUser', () => {
    describe('when deleteUser is called', () => {
      beforeEach(() => {
        userRepository.findOne = jest
          .fn()
          .mockImplementation(async () => await userStub());
      });
      test('then it should find a user and delete the user', async () => {
        const result = await service.deleteUser(userStub().id);

        expect(userRepository.findOne).toHaveBeenCalledWith({
          id: userStub().id,
        });

        expect(userRepository.delete).toHaveBeenCalledWith({
          id: userStub().id,
        });

        expect(result).toEqual({ message: 'User deleted successfully' });
      });
    });
  });
  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      beforeEach(() => {
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
        userRepository.findOne = jest
          .fn()
          .mockImplementation(async () => await userStub());
        service.findOneById = jest
          .fn()
          .mockImplementation(
            async () => await { ...userStub(), password: 'hashedPassword' },
          );
        service.findOneByEmail = jest.fn().mockImplementation(() => null);
      });
      test('then it should find a user and update the user', async () => {
        const result = await service.updateUser(
          {
            email: userStub().email,
            password: userStub().password,
            photo: userStub().photo,
          },
          userStub().id,
        );

        expect(service.findOneByEmail).toHaveBeenCalled();

        expect(userRepository.findOne).toHaveBeenCalledWith({
          id: userStub().id,
        });

        expect(userRepository.update).toHaveBeenCalledWith(
          { id: userStub().id },
          {
            email: userStub().email,
            password: 'hashedPassword',
            photo: userStub().photo,
          },
        );

        expect(service.findOneById).toHaveBeenCalledWith(userStub().id);

        expect(result).toEqual({ ...userStub(), password: 'hashedPassword' });
      });
    });
  });
  describe('updateUserPhoto', () => {
    describe('when updateUserPhoto is called', () => {
      beforeEach(() => {
        userRepository.findOne = jest
          .fn()
          .mockImplementation(async () => await userStub());
      });
      test('then it should find a user and update the user', async () => {
        const result = await service.updateUserPhoto(
          userStub().photo,
          userStub().id,
        );

        expect(userRepository.findOne).toHaveBeenCalledWith({
          id: userStub().id,
        });

        expect(userRepository.update).toHaveBeenCalledWith(
          { id: userStub().id },
          { photo: `/${userStub().photo}` },
        );

        expect(result).toEqual(userStub().photo);
      });
    });
  });
});
