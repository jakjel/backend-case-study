import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test as NestTest, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppController } from '../src/use-cases/tenant-use-case/tenant.app.controller';
import { ApplicationService } from '../src/use-cases/tenant-use-case/tenant.data.application.service';
import { TenantDataService } from '../src/use-cases/tenant-use-case/tenant.data.service';
import { UpdateCustomerDTO } from '../src/model/customer-update.dto';
import { CreateCustomerDTO } from 'src/model/customer-create.dto';

describe('AppController (e2e) with real services', () => {
  let app: INestApplication;
  let server: any;

  // will be filled from the first GET /
  let firstCustomerId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await NestTest.createTestingModule({
      controllers: [AppController],
      providers: [ApplicationService, TenantDataService],
    }).compile();

    app = moduleRef.createNestApplication();

    // Enable validation globally, as in main.ts
    app.useGlobalPipes(
      new ValidationPipe(),
    );

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / → returns the seeded customers (>= 5)', async () => {
    const res = await request(server).get('/').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(5);

    firstCustomerId = res.body[0].userId;
    expect(typeof firstCustomerId).toBe('string');

    // Checks since Faker is random
    const c0 = res.body[0];
    expect(c0).toHaveProperty('userId');
    expect(c0).toHaveProperty('username');
    expect(c0).toHaveProperty('email');
    expect(c0).toHaveProperty('firstName');
    expect(c0).toHaveProperty('lastName');
    expect(c0).toHaveProperty('avatar');
    expect(c0).toHaveProperty('birthday');
    expect(c0).toHaveProperty('registeredAt');
  });

  it('GET /:id → returns one by id', async () => {
    const res = await request(server).get(`/${firstCustomerId}`).expect(200);
    expect(res.body).toHaveProperty('userId', firstCustomerId);
  });

  it('POST / → creates a new customer and increases the count', async () => {
    const before = await request(server).get('/').expect(200);
    const beforeCount = before.body.length;

    // Send string; ValidationPipe + @Type(() => Date) will convert to Date
    const payload: CreateCustomerDTO = {
      username: 'alice_e2e',
      email: 'alice_e2e@example.com',
      password: 'secret123',
      firstName: 'Alice',
      lastName: 'E2E',
      avatar: 'https://example.com/alice.png',
      birthday: new Date('1992-03-03'),
    };

    const created = await request(server).post('/').send(payload);

    expect(created.status).toBe(201);
    expect(created.body).toHaveProperty('userId');

    expect(created.body).toMatchObject({
      username: 'alice_e2e',
      firstName: 'Alice',
      lastName: 'E2E',
      avatar: 'https://example.com/alice.png',
    });
    expect(new Date(created.body.birthday).toISOString()).toBe('1992-03-03T00:00:00.000Z');
    expect(created.body).toHaveProperty('registeredAt');

    const after = await request(server).get('/').expect(200);
    expect(after.body.length).toBe(beforeCount + 1);
  });

  it('PUT /:id → updates only provided fields; "" overwrites', async () => {

    const created = await request(server)
      .post('/')
      .send({
        username: 'to_update',
        email: 'to_update@example.com',
        password: 'secret123',
        firstName: 'Original',
        lastName: 'Name',
        avatar: 'https://example.com/original.png',
        birthday: '1990-01-01T00:00:00.000Z',
      })
      .expect(201);

    const id = created.body.userId;

    const payload: Partial<UpdateCustomerDTO> = {
      firstName: 'Johnny',
      avatar: '',
    };

    const updated = await request(server).put(`/${id}`).send(payload).expect(201);

    // Assert updated fields
    expect(updated.body).toMatchObject({
      userId: id,
      firstName: 'Johnny',
      avatar: '',
    });

    // Assert untouched field (lastName) kept original value
    const refetch = await request(server).get(`/${id}`).expect(200);
    expect(refetch.body.firstName).toBe('Johnny');
    expect(refetch.body.avatar).toBe('');
    expect(refetch.body.lastName).toBe('Name'); // original from creation above
  });

  it('GET /:id → 404 for unknown id', async () => {
    await request(server).get('/does-not-exist-id').expect(404);
  });
});
