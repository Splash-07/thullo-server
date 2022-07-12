import { Test, TestingModule } from '@nestjs/testing';
import { boardStub } from '../../boards/tests/stubs/board.stub';
import { userStub } from '../../users/tests/stubs/user.stub';
import { UploadsController } from '../uploads.controller';
import { UploadsService } from '../uploads.service';

jest.mock('../uploads.service');

describe('UploadsController', () => {
  let uploadsController: UploadsController;
  let uploadsService: UploadsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UploadsController],
      providers: [UploadsService],
    }).compile();

    uploadsController = moduleRef.get<UploadsController>(UploadsController);
    uploadsService = moduleRef.get<UploadsService>(UploadsService);
  });

  it('should be defined', () => {
    expect(uploadsController).toBeDefined();
  });

  describe('uploadUserPhoto', () => {
    describe('when uploadUserPhoto is called', () => {
      beforeEach(async () => {
        await uploadsController.uploadUserPhoto(userStub(), {
          filename: userStub().photo,
        });
      });

      test('then it should call uploadsService', () => {
        expect(uploadsService.uploadUserPhoto).toHaveBeenCalledWith(
          userStub().id,
          userStub().photo,
        );
      });
    });
  });
  describe('uploadBoardPhoto', () => {
    describe('when uploadBoardPhoto is called', () => {
      beforeEach(async () => {
        await uploadsController.uploadBoardPhoto(boardStub().id, userStub(), {
          filename: 'test.jpg',
        });
      });

      test('then it should call uploadsService', () => {
        expect(uploadsService.uploadBoardPhoto).toHaveBeenCalledWith(
          boardStub().id,
          userStub().id,
          '/test.jpg',
        );
      });
    });
  });
});
