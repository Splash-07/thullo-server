import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../../users/tests/stubs/user.stub';
import { CommentsController } from '../comments.controller';
import { CommentsService } from '../comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../dtos';
import { Comment } from '../entities/comment.entity';
import { commentStub } from './stubs/comment.stub';
jest.mock('../comments.service');

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CommentsController],
      providers: [CommentsService],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  describe('createComment', () => {
    describe('when createComment is called', () => {
      let createCommentDto: CreateCommentDto;
      let comment: Comment;

      beforeEach(async () => {
        createCommentDto = {
          comment: commentStub().comment,
        };

        comment = await commentsController.createComment(
          userStub(),
          createCommentDto,
          commentStub().cardId,
        );
      });

      test('then it should call commentsService', () => {
        expect(commentsService.createComment).toHaveBeenCalledWith(
          userStub().id,
          createCommentDto,
          commentStub().cardId,
        );
      });

      test('then it should return the comment', () => {
        expect(comment).toEqual(commentStub());
      });
    });
  });
  describe('updateComment', () => {
    describe('when updateComment is called', () => {
      let updateCommentDto: UpdateCommentDto;
      let comment: Comment;

      beforeEach(async () => {
        updateCommentDto = {
          comment: commentStub().comment,
        };

        comment = await commentsController.updateComment(
          commentStub().id,
          updateCommentDto,
        );
      });

      test('then it should call commentsService', () => {
        expect(commentsService.updateComment).toHaveBeenCalledWith(
          commentStub().id,
          updateCommentDto,
        );
      });

      test('then it should return the comment', () => {
        expect(comment).toEqual({ ...commentStub(), comment: 'updated' });
      });
    });
  });
  describe('deleteComment', () => {
    describe('when deleteComment is called', () => {
      let result: { message: string };

      beforeEach(async () => {
        result = await commentsController.deleteComment(
          userStub(),
          commentStub().id,
        );
      });

      test('then it should call commentsService', () => {
        expect(commentsService.deleteComment).toHaveBeenCalledWith(
          userStub().id,
          commentStub().id,
        );
      });

      test('then it should return the comment', () => {
        expect(result).toEqual({ message: 'Comment deleted' });
      });
    });
  });
});
