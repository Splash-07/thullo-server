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

describe('CardsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let cookie: string;
  let listId: string;
  let cardId: string;

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
  describe('setListId', () => {
    test('Should create a list', async () => {
      const board = await request(httpServer)
        .post('/boards')
        .set('Cookie', cookie)
        .send({ title: boardStub().title })
        .expect(201);

      const response = await request(httpServer)
        .post(`/lists/${board.body.id}`)
        .set('Cookie', cookie)
        .send({ title: listStub().title })
        .expect(201);

      listId = response.body.id;
    });
  });
  describe('createCard', () => {
    test('Should create a card', async () => {
      const response = await request(httpServer)
        .post(`/cards/${listId}`)
        .set('Cookie', cookie)
        .send({ title: cardStub().title })
        .expect(201);

      expect(response.body.title).toBe(cardStub().title);

      cardId = response.body.id;
    });
  });
  describe('updateCard', () => {
    test('Should update a card', async () => {
      const response = await request(httpServer)
        .patch(`/cards/${cardId}`)
        .set('Cookie', cookie)
        .send({ title: 'updated' })
        .expect(200);

      expect(response.body.title).toBe('updated');
    });
  });
  describe('updateCardPosition', () => {
    test('Should update a card position', async () => {
      const card = await request(httpServer)
        .post(`/cards/${listId}`)
        .set('Cookie', cookie)
        .send({ title: cardStub().title })
        .expect(201);

      const response = await request(httpServer)
        .patch(`/cards/position/${cardId}/${card.body.id}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
    });
  });
  describe('changeCardList', () => {
    test('Should change a card list', async () => {
      const response = await request(httpServer)
        .patch(`/cards/${cardId}/lists/${listId}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
    });
  });
  describe('getCard', () => {
    test('Should get a card', async () => {
      const response = await request(httpServer)
        .get(`/cards/${cardId}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
    });
  });
  describe('deleteCard', () => {
    test('Should delete a card', async () => {
      const response = await request(httpServer)
        .delete(`/cards/${cardId}/list/${listId}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(200);

      expect(response.body).toEqual({ message: 'Deleted card' });
    });
  });
});
