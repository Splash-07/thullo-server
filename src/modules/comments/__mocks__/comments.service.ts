import { commentStub } from '../tests/stubs/comment.stub';

export const CommentsService = jest.fn().mockReturnValue({
  createComment: jest.fn().mockResolvedValue(commentStub()),
  updateComment: jest
    .fn()
    .mockResolvedValue({ ...commentStub(), comment: 'updated' }),
  deleteComment: jest.fn().mockResolvedValue({ message: 'Comment deleted' }),
});
