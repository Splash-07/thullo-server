import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepository } from 'typeorm';
import { userStub } from '../src/modules/users/tests/stubs/user.stub';
import { TypeormStore } from 'connect-typeorm/out';
import * as passport from 'passport';
import * as session from 'express-session';
import { Session } from '../src/modules/auth/entities/session.entity';
import { boardStub } from '../src/modules/boards/tests/stubs/board.stub';
import { listStub } from '../src/modules/lists/tests/stubs/list.stub';
import { cardStub } from '../src/modules/cards/tests/stubs/card.stub';
import { commentStub } from '../src/modules/comments/tests/stubs/comment.stub';

describe('CardsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let cookie: string;
  let cardId: string;
  let commentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const sessionRepository = getRepository(Session);

    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000,
        },
        store: new TypeormStore({
          cleanupLimit: 2,
        }).connect(sessionRepository),
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('set-cookie', () => {
    test('Should set a cookie', async () => {
      await request(httpServer)
        .post('/users')
        .send({ email: userStub().email, password: userStub().password });

      const response = await request(httpServer)
        .post('/users/login')
        .send({ email: userStub().email, password: userStub().password });

      cookie = response.header['set-cookie'][0];
    });
  });
  describe('setCardId', () => {
    test('Should create a card and return id', async () => {
      const board = await request(httpServer)
        .post('/boards')
        .set('Cookie', cookie)
        .send({ title: boardStub().title })
        .expect(201);

      const list = await request(httpServer)
        .post(`/lists/${board.body.id}`)
        .set('Cookie', cookie)
        .send({ title: listStub().title })
        .expect(201);

      const card = await request(httpServer)
        .post(`/cards/${list.body.id}`)
        .set('Cookie', cookie)
        .send({ title: cardStub().title })
        .expect(201);

      cardId = card.body.id;
    });
  });
  describe('createComment', () => {
    test('Should create a comment', async () => {
      const response = await request(httpServer)
        .post(`/comments/${cardId}`)
        .set('Cookie', cookie)
        .send({ comment: commentStub().comment })
        .expect(201);

      expect(response.body.comment).toBe(commentStub().comment);

      commentId = response.body.id;
    });
  });
  describe('updateComment', () => {
    test('Should update a comment', async () => {
      const response = await request(httpServer)
        .patch(`/comments/${commentId}`)
        .set('Cookie', cookie)
        .send({ comment: 'updated' })
        .expect(200);

      expect(response.body.comment).toBe('updated');
    });
  });
  describe('deleteComment', () => {
    test('Should delete a comment', async () => {
      const response = await request(httpServer)
        .delete(`/comments/${commentId}`)
        .set('Cookie', cookie)
        .expect(200);

      expect(response.body).toEqual({ message: 'Comment deleted' });
    });
  });
});
