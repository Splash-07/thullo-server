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

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let cookie: string;

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

  describe('register', () => {
    test('Should create a user', async () => {
      const response = await request(httpServer)
        .post('/users')
        .send({ email: userStub().email, password: userStub().password });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User created successfully' });
    });
  });
  describe('login', () => {
    test('Should login a user', async () => {
      const response = await request(httpServer)
        .post('/users/login')
        .send({ email: userStub().email, password: userStub().password });

      expect(response.status).toBe(200);
      expect(response.body.email).toEqual(userStub().email);

      cookie = response.header['set-cookie'][0];
    });
  });
  describe('updateUser', () => {
    test('Should update a user', async () => {
      const response = await request(httpServer)
        .patch('/users')
        .send({ photo: userStub().photo })
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body.photo).toEqual(userStub().photo);
    });
  });
  describe('getUser', () => {
    test('Should get a user', async () => {
      const response = await request(httpServer)
        .get('/users')
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body.email).toEqual(userStub().email);
      expect(response.body.photo).toEqual(userStub().photo);
    });
  });
  describe('logout', () => {
    test('Should logout a user', async () => {
      const response = await request(httpServer)
        .delete('/users/logout')
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Successful logout',
      });
    });
  });
  describe('deleteUser', () => {
    test('Should delete a user', async () => {
      const user = await request(httpServer)
        .post('/users/login')
        .send({ email: userStub().email, password: userStub().password });

      cookie = user.header['set-cookie'][0];

      const response = await request(httpServer)
        .delete('/users')
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted successfully' });
    });
  });
});
