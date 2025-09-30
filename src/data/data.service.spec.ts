import { NotFoundException } from '@nestjs/common';
import { DataService } from './data.service';
import { Customer } from '../model/customer';
import { faker } from '@faker-js/faker';

describe('DataService (with mocked Faker)', () => {
  let service: DataService;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00Z'));
    jest.clearAllMocks();
    service = new DataService();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('createRandomUser (private) – mocked Faker', () => {
    it('builds a deterministic Customer from faker fields', () => {
      // Arrange (Faker v7 API)
      const uuidSpy = jest.spyOn(faker.datatype, 'uuid').mockReturnValue('uuid-123');
      const userNameSpy = jest.spyOn(faker.internet, 'userName').mockReturnValue('johnny');
      const emailSpy = jest.spyOn(faker.internet, 'email').mockReturnValue('johnny@example.com');
      const avatarSpy = jest.spyOn(faker.image, 'avatar').mockReturnValue('https://img/avatar.png');
      const passwordSpy = jest.spyOn(faker.internet, 'password').mockReturnValue('S3cr3t!');
      const datePastSpy = jest
        .spyOn(faker.date, 'past')
        .mockReturnValueOnce(new Date('1992-05-05T00:00:00Z'))  // birthday
        .mockReturnValueOnce(new Date('2025-03-10T00:00:00Z')); // registeredAt
      const firstSpy = jest.spyOn(faker.name, 'firstName').mockReturnValue('John');
      const lastSpy = jest.spyOn(faker.name, 'lastName').mockReturnValue('Doe');

      const created: Customer = (service as any).createRandomUser();

      // Assert
      expect(created).toBeInstanceOf(Customer);
      expect(created.userId).toBe('uuid-123');
      expect(created.username).toBe('johnny');
      expect(created.email).toBe('johnny@example.com');
      expect(created.avatar).toBe('https://img/avatar.png');
      expect(created.password).toBe('S3cr3t!');
      expect(created.firstName).toBe('John');
      expect(created.lastName).toBe('Doe');
      expect(created.birthday.toISOString()).toBe('1992-05-05T00:00:00.000Z');
      expect(created.registeredAt.toISOString()).toBe('2025-03-10T00:00:00.000Z');

      expect(uuidSpy).toHaveBeenCalledTimes(1);
      expect(userNameSpy).toHaveBeenCalledTimes(1);
      expect(emailSpy).toHaveBeenCalledTimes(1);
      expect(avatarSpy).toHaveBeenCalledTimes(1);
      expect(passwordSpy).toHaveBeenCalledTimes(1);
      expect(datePastSpy).toHaveBeenCalledTimes(2);
      expect(firstSpy).toHaveBeenCalledTimes(1);
      expect(lastSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleInit – spy na private createRandomUser', () => {
    it('pushne přesně 5 customers', async () => {
      const fixtures: Customer[] = Array.from({ length: 5 }, (_, i) =>
        new Customer({
          userId: `id-${i + 1}`,
          username: `u${i + 1}`,
          email: `u${i + 1}@ex.com`,
          avatar: `https://avatar/${i + 1}.png`,
          password: 'x',
          birthday: new Date(`1990-01-0${(i % 9) + 1}T00:00:00Z`),
          registeredAt: new Date(`2025-01-0${(i % 9) + 1}T00:00:00Z`),
          firstName: `F${i + 1}`,
          lastName: `L${i + 1}`,
        }),
      );

      const svcAny = service as any;
      const spy = jest
        .spyOn(svcAny, 'createRandomUser')
        .mockReturnValueOnce(fixtures[0])
        .mockReturnValueOnce(fixtures[1])
        .mockReturnValueOnce(fixtures[2])
        .mockReturnValueOnce(fixtures[3])
        .mockReturnValueOnce(fixtures[4]);

      await service.onModuleInit();

      const all = await service.fetchAll();
      expect(all).toHaveLength(5);
      expect(all).toEqual(fixtures);
      expect(spy).toHaveBeenCalledTimes(5);
    });
  });

  describe('createCustomer – deterministic id', () => {
    it('assigns mocked uuid and current registeredAt', async () => {
      jest.spyOn(faker.datatype, 'uuid').mockReturnValue('const-uuid-0001');

      const created = await service.createCustomer({
        username: 'alice',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'A.',
      });

      expect(created.userId).toBe('const-uuid-0001');
      expect(created.registeredAt.toISOString()).toBe('2025-01-01T12:00:00.000Z'); 
      expect(created.username).toBe('alice');
      expect(created.email).toBe('alice@example.com');
    });
  });

  describe('getById / updateCustomer – business logika', () => {
    it('getById vrátí vytvořený záznam', async () => {
      jest.spyOn(faker.datatype, 'uuid').mockReturnValue('id-xyz');
      const c = await service.createCustomer({ username: 'john', email: 'john_doe@gmail.com' });

      const found = await service.getById('id-xyz');
      expect(found).toBeDefined();
      expect(found.userId).toBe(c.userId);
      expect(found.email).toBe('john_doe@gmail.com');
    });

    it('getById vyhodí NotFound pro neexistující id', async () => {
      await expect(service.getById('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('updateCustomer updatuje jen nenedefinované fieldy', async () => {
      jest.spyOn(faker.datatype, 'uuid').mockReturnValue('id-1');
      const c = await service.createCustomer({
        username: 'john',
        email: 'john_doe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://a/1.png',
      });

      const originalRegisteredAt = c.registeredAt;

      const updated = await service.updateCustomer('id-1', {
        firstName: 'John',   // změna (stejná hodnota, ale logika ji zapíše)
        lastName: undefined, // ignorovat
        avatar: '',          // prázdný string přepíše na ''
      });

      expect(updated.userId).toBe('id-1');
      expect(updated.registeredAt).toEqual(originalRegisteredAt);

      expect(updated.firstName).toBe('John');           // změněno
      expect(updated.lastName).toBe('Doe');             // nezměněno (undefined ignorováno)
      expect(updated.avatar).toBe('');                  // přepsáno na ''
      expect(updated.email).toBe('john_doe@gmail.com'); // nezměněno
    });

    it('updateCustomer vyhodí NotFound pro neexistující id', async () => {
      await expect(service.updateCustomer('nope', { firstName: 'X' }))
        .rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
