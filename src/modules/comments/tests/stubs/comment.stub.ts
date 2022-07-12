import { Comment } from '../../entities/comment.entity';

export const commentStub = () => {
  const commentStub = new Comment();

  commentStub.comment = 'test';
  commentStub.id = '123456';
  commentStub.createdAt = new Date('2022-01-01');
  commentStub.updatedAt = new Date('2022-01-01');
  commentStub.cardId = '1234567';
  commentStub.userId = '12345678';

  return commentStub;
};
