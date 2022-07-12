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

describe('ListsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let cookie: string;
  let boardId: string;
  let listId: string;

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
  describe('setBoardId', () => {
    test('Should set a boardId', async () => {
      const response = await request(httpServer)
        .post('/boards')
        .set('Cookie', cookie)
        .send({ title: boardStub().title })
        .expect(201);
      boardId = response.body.id;
    });
  });
  describe('createList', () => {
    test('Should create a list', async () => {
      const response = await request(httpServer)
        .post(`/lists/${boardId}`)
        .set('Cookie', cookie)
        .send({ title: listStub().title });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(listStub().title);
      listId = response.body.id;
    });
  });
  describe('updateList', () => {
    test('Should update a list', async () => {
      const response = await request(httpServer)
        .patch(`/lists/${listId}`)
        .set('Cookie', cookie)
        .send({ title: listStub().title });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(listStub().title);
    });
  });
  describe('updateListPosition', () => {
    test('Should update a list position', async () => {
      const newList = await request(httpServer)
        .patch(`/lists/${listId}`)
        .set('Cookie', cookie)
        .send({ title: 'new list' });

      const response = await request(httpServer)
        .patch(`/lists/position/${listId}/${newList.body.id}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
    });
  });
  describe('getLists', () => {
    test('Should get all lists', async () => {
      const response = await request(httpServer)
        .get(`/lists/${boardId}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });
  describe('deleteList', () => {
    test('Should delete a list', async () => {
      const response = await request(httpServer)
        .delete(`/lists/${listId}/boards/${boardId}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Deleted list' });
    });
  });
});
