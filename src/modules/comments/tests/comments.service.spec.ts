import { Test, TestingModule } from '@nestjs/testing';
import { Card } from '../../cards/entities/card.entity';
import { Repository } from 'typeorm';
import { CommentsService } from '../comments.service';
import { Comment } from '../entities/comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { commentStub } from './stubs/comment.stub';
import { cardStub } from '../../cards/tests/stubs/card.stub';
import { CreateCommentDto, UpdateCommentDto } from '../dtos';
import { userStub } from '../../users/tests/stubs/user.stub';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentsRepository: Repository<Comment>;
  let cardsRepository: Repository<Card>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            findOne: jest.fn().mockImplementation(() => commentStub()),
            save: jest.fn().mockImplementation(() => commentStub()),
            create: jest.fn().mockImplementation(() => commentStub()),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Card),
          useValue: {
            findOne: jest.fn().mockImplementation(() => cardStub()),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    cardsRepository = module.get<Repository<Card>>(getRepositoryToken(Card));
    commentsRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
  });

  test('service should be defined', () => {
    expect(service).toBeDefined();
  });
  test('repository is defined', () => {
    expect(commentsRepository).toBeDefined();
    expect(cardsRepository).toBeDefined();
  });

  describe('createComment', () => {
    describe('when createComment is called', () => {
      let createCommentDto: CreateCommentDto;
      let result: Comment;
      beforeEach(async () => {
        createCommentDto = {
          comment: commentStub().comment,
        };
        result = await service.createComment(
          userStub().id,
          createCommentDto,
          cardStub().id,
        );
      });

      test('then it should call findOne, create, and save', () => {
        expect(cardsRepository.findOne).toHaveBeenCalledWith({
          id: cardStub().id,
        });
        expect(commentsRepository.create).toHaveBeenCalledWith({
          ...createCommentDto,
          userId: userStub().id,
          cardId: cardStub().id,
        });

        expect(commentsRepository.save).toHaveBeenCalledWith(result);
      });

      test('then it should return a new comment', () => {
        expect(result).toEqual(commentStub());
      });
    });
  });
  describe('updateComment', () => {
    describe('when updateComment is called', () => {
      let updateCommentDto: UpdateCommentDto;
      let result: Comment;
      beforeEach(async () => {
        updateCommentDto = {
          comment: commentStub().comment,
        };
        result = await service.updateComment(
          commentStub().id,
          updateCommentDto,
        );
      });

      test('then it should call findOne, and save', () => {
        expect(commentsRepository.findOne).toHaveBeenCalledWith({
          id: commentStub().id,
        });
        expect(commentsRepository.save).toHaveBeenCalledWith(result);
      });

      test('then it should return a new comment', () => {
        expect(result).toEqual(commentStub());
      });
    });
  });
  describe('deleteComment', () => {
    describe('when deleteComment is called', () => {
      let result: { message: string };
      beforeEach(async () => {
        result = await service.deleteComment(userStub().id, commentStub().id);
      });

      test('then it should call findOne, and remove', () => {
        expect(commentsRepository.findOne).toHaveBeenCalledWith({
          id: commentStub().id,
          userId: userStub().id,
        });
        expect(commentsRepository.remove).toHaveBeenCalledWith(commentStub());
      });

      test('then it should return a new comment', () => {
        expect(result).toEqual({ message: 'Comment deleted' });
      });
    });
  });
});
