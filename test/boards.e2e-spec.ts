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

describe('BoardsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let cookie: string;
  let boardId: string;

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

  describe('createBoard', () => {
    test('Should create a board', async () => {
      const response = await request(httpServer)
        .post('/boards')
        .set('Cookie', cookie)
        .send({ title: boardStub().title });

      expect(response.status).toBe(201);
      expect(response.body.title).toEqual(boardStub().title);
      boardId = response.body.id;
    });
  });
  describe('updateBoard', () => {
    test('Should update a board', async () => {
      const response = await request(httpServer)
        .patch(`/boards/${boardId}`)
        .set('Cookie', cookie)
        .send({ title: 'updated' });

      expect(response.status).toBe(200);
      expect(response.body.title).toEqual('updated');
    });
  });
  describe('getBoards', () => {
    test('Should get array of boards', async () => {
      const response = await request(httpServer)
        .get('/boards')
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body[0].title).toEqual('updated');
    });
  });
  describe('getBoard', () => {
    test('Should get a board', async () => {
      const response = await request(httpServer)
        .get(`/boards/${boardId}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body.title).toEqual('updated');
    });
  });
  describe('deleteBoard', () => {
    test('Should delete a board', async () => {
      const response = await request(httpServer)
        .delete(`/boards/${boardId}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Board deleted' });
    });
  });
});
