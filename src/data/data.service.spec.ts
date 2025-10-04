import { DataService } from './data.service';
import { Customer } from '../model/customer';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DataService (repo mocked, service unchanged)', () => {
  let service: DataService;
  let repo: jest.Mocked<Repository<Customer>>;
  let store: Customer[];

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00Z'));
    jest.clearAllMocks();

    store = [];

    // TypeORM-like behavior (enough for these tests)
    const repoMock: Partial<jest.Mocked<Repository<Customer>>> = {
      count: jest.fn().mockImplementation(async () => store.length),

      create: jest.fn().mockImplementation((dto: Partial<Customer>) => new Customer(dto)),

      find: jest.fn().mockImplementation(async () => [...store]),

      findOneBy: jest.fn().mockImplementation(async (where: Partial<Customer>) => {
        const id = (where as any)?.userId;
        return store.find(s => s.userId === id) ?? null;
      }),

      save: jest.fn().mockImplementation(async (input: any) => {
        const saveOne = (c: Customer | Partial<Customer>) => {
          const entity = c instanceof Customer ? c : new Customer(c);
          // upsert by userId if present, else push new
          const idx = entity.userId ? store.findIndex(s => s.userId === entity.userId) : -1;
          if (idx >= 0) {
            store[idx] = { ...store[idx], ...entity };
            return store[idx];
          }
          store.push(entity as Customer);
          return entity as Customer;
        };

        if (Array.isArray(input)) {
          return input.map(saveOne);
        }
        return saveOne(input);
      }),

      update: jest.fn().mockImplementation(async (where: Partial<Customer>, patch: Partial<Customer>) => {
        const id = (where as any)?.userId;
        const idx = store.findIndex(s => s.userId === id);
        if (idx < 0) return { affected: 0 } as any;

        // mimic TypeORM: skip undefined fields, apply defined (including empty string, null)
        const definedEntries = Object.entries(patch).filter(([, v]) => v !== undefined);
        const filteredPatch = Object.fromEntries(definedEntries) as Partial<Customer>;

        store[idx] = { ...store[idx], ...filteredPatch };
        return { affected: 1 } as any;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        { provide: getRepositoryToken(Customer), useValue: repoMock },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    repo = module.get(getRepositoryToken(Customer));

    // trigger seeding path in onModuleInit (count()==0)
    await module.init();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('onModuleInit – generic seeding', () => {
    it('seeds exactly 5 customers when repo is empty', async () => {
      // after module.init(), our repoMock.save should have been called if count()===0
      expect(repo.count).toHaveBeenCalled();
      expect(store.length).toBe(5);
      const all = await service.fetchAll();
      expect(all).toHaveLength(5);
    });

    it('does NOT reseed if customers already exist', async () => {
      // simulate a second init
      await (service as any).onModuleInit();
      // still 5
      expect(store.length).toBe(5);
    });
  });

  describe('createCustomer – passes through to repo.save (no uuid/now added by service)', () => {
    it('saves the provided fields and returns the saved entity', async () => {
      const created = await service.createCustomer({
        userId: 'manual-1',
        username: 'alice',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'A.',
      });

      expect(created).toBeDefined();
      expect(created.userId).toBe('manual-1'); // service does NOT generate id
      expect(created.username).toBe('alice');
      expect(created.email).toBe('alice@example.com');

      const all = await service.fetchAll();
      // there were 5 seeded + this one
      expect(all).toHaveLength(6);
      expect(all.find(c => c.userId === 'manual-1')).toBeTruthy();
    });
  });

  describe('getById / updateCustomer – behavior with current service', () => {
    it('getById returns the created record', async () => {
      // create and then get
      await service.createCustomer({ userId: 'id-xyz', username: 'john', email: 'john_doe@gmail.com' });

      const found = await service.getById('id-xyz'); // current service returns entity or null (no NotFoundException)
      expect(found).toBeDefined();
      expect(found?.userId).toBe('id-xyz');
      expect(found?.email).toBe('john_doe@gmail.com');
    });

    it('getById returns null for non-existing id (no NotFoundException thrown)', async () => {
      const found = await service.getById('missing');
      expect(found).toBeNull();
    });

    it('updateCustomer updates only defined fields (keeps registeredAt by default)', async () => {
      // seed one with registeredAt
      const initial = await service.createCustomer({
        userId: 'id-1',
        username: 'john',
        email: 'john_doe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://a/1.png',
        registeredAt: new Date('2024-12-31T00:00:00Z'),
      });

      const originalRegisteredAt = initial.registeredAt;

      // undefined fields should be ignored; empty string applied
      await service.updateCustomer('id-1', {
        firstName: 'John',
        lastName: undefined,
        avatar: '',
      });

      const updated = await service.getById('id-1');
      expect(updated).not.toBeNull();
      expect(updated!.userId).toBe('id-1');
      expect(updated!.registeredAt?.toISOString()).toBe(originalRegisteredAt?.toISOString());

      expect(updated!.firstName).toBe('John');
      // lastName unchanged because undefined was ignored by our mock (mimic TypeORM)
      expect(updated!.lastName).toBe('Doe');
      expect(updated!.avatar).toBe('');
      expect(updated!.email).toBe('john_doe@gmail.com');
    });

    it('updateCustomer returns null for non-existing id (service does not throw)', async () => {
      const result = await service.updateCustomer('nope', { firstName: 'X' });
      expect(result).toBeNull();
    });
  });
});

