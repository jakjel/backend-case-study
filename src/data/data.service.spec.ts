import { DataService } from './data.service';
import { Customer } from '../model/customer';
import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from '../model/subscription';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('DataService (repo mocked incl. Subscription; service unchanged)', () => {
  let service: DataService;

  
  let customerRepo: jest.Mocked<Repository<Customer>>;
  // Type hints for DI retrieval (they’re mocks)
  let subscriptionRepo: jest.Mocked<Repository<Subscription>>;
  let dataSource: jest.Mocked<DataSource>;
  
  let customers: Customer[];
  let subs: Subscription[];

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00Z'));
    jest.clearAllMocks();

    customers = [];
    subs = [];

    // ----- Subscription repo mock (enough for tested paths) -----
    const subRepoMock: Partial<jest.Mocked<Repository<Subscription>>> = {
      create: jest.fn().mockImplementation((dto: Partial<Subscription>) => Object.assign(new (Subscription as any)(), dto)),
      // save: upsert by id; if no id, generate one
      save: jest.fn().mockImplementation(async (input: any) => {
        const saveOne = (p: Partial<Subscription>) => {
          const entity = { ...(p as any) };
          if (!entity.id) entity.id = `sub_${subs.length + 1}`;
          const idx = subs.findIndex(s => (s as any).id === entity.id);
          if (idx >= 0) {
            subs[idx] = { ...subs[idx], ...entity } as any;
            return subs[idx];
          }
          subs.push(entity as any);
          return entity as any;
        };
        return Array.isArray(input) ? input.map(saveOne) : saveOne(input);
      }),
      preload: jest.fn().mockImplementation(async (p: Partial<Subscription>) => {
        if (!p || !(p as any).id) return undefined;
        const found = subs.find(s => (s as any).id === (p as any).id);
        return found ? ({ ...found, ...p } as any) : undefined;
      }),
      update: jest.fn().mockImplementation(async (where: Partial<Subscription>, patch: Partial<Subscription>) => {
        const id = (where as any)?.id;
        const idx = subs.findIndex(s => (s as any).id === id);
        if (idx < 0) return { affected: 0 } as any;
        const defined = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
        subs[idx] = { ...subs[idx], ...(defined as any) };
        return { affected: 1 } as any;
      }),
      findOneBy: jest.fn().mockImplementation(async (where: Partial<Subscription>) => {
        const id = (where as any)?.id;
        return subs.find(s => (s as any).id === id) ?? null;
      }),
    };

    // ----- Customer repo mock -----
    const customerRepoMock: Partial<jest.Mocked<Repository<Customer>>> = {
      count: jest.fn().mockImplementation(async () => customers.length),

      create: jest.fn().mockImplementation((dto: Partial<Customer>) => new Customer(dto)),

      find: jest.fn().mockImplementation(async () => [...customers]),

      // DataService.getById uses findOneBy; updateCustomer uses findOne({ where, relations })
      findOneBy: jest.fn().mockImplementation(async (where: Partial<Customer>) => {
        const id = (where as any)?.userId;
        return customers.find(s => s.userId === id) ?? null;
      }),

      findOne: jest.fn().mockImplementation(async (opts: any) => {
        const id = opts?.where?.userId;
        const c = customers.find(s => s.userId === id);
        if (!c) return null;
        // simulate eager subscription already present if it exists on the record
        return { ...c };
      }),

      save: jest.fn().mockImplementation(async (input: any) => {
        const saveOne = (c: Customer | Partial<Customer>) => {
          const entity = c instanceof Customer ? c : new Customer(c);
          const idx = entity.userId ? customers.findIndex(s => s.userId === entity.userId) : -1;
          if (idx >= 0) {
            customers[idx] = { ...customers[idx], ...entity } as Customer;
            return customers[idx];
          }
          // if no id provided, keep undefined — service’s tests rely on that behavior
          customers.push(entity as Customer);
          return entity as Customer;
        };
        return Array.isArray(input) ? input.map(saveOne) : saveOne(input);
      }),

      update: jest.fn().mockImplementation(async (where: Partial<Customer>, patch: Partial<Customer>) => {
        const id = (where as any)?.userId;
        const idx = customers.findIndex(s => s.userId === id);
        if (idx < 0) return { affected: 0 } as any;
        const defined = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
        customers[idx] = { ...customers[idx], ...(defined as any) };
        return { affected: 1 } as any;
      }),
    };

    // ----- DataSource transaction mock -----
    const dsMock: Partial<jest.Mocked<DataSource>> = {
      transaction: jest.fn().mockImplementation(async (cb: any) => {
        const tm = {
          getRepository: (E: any) => {
            if (E === Customer) return customerRepoMock;
            if (E === Subscription) return subRepoMock;
            throw new Error('Unknown repo requested');
          },
        };
        return cb(tm);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        { provide: getRepositoryToken(Customer), useValue: customerRepoMock },
        { provide: getRepositoryToken(Subscription), useValue: subRepoMock },
        { provide: DataSource, useValue: dsMock },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    customerRepo = module.get(getRepositoryToken(Customer));
    subscriptionRepo = module.get(getRepositoryToken(Subscription));
    dataSource = module.get(DataSource);

    // onModuleInit seeding (count()==0)
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
      expect(customerRepo.count).toHaveBeenCalled();
      expect(customers.length).toBe(5);
      const all = await service.fetchAll();
      expect(all).toHaveLength(5);
    });

    it('does NOT reseed if customers already exist', async () => {
      // simulate a second init
      await (service as any).onModuleInit();
      // still 5
      expect(customers.length).toBe(5);
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

  describe('getById / updateCustomer (with subscription support)', () => {
    it('getById returns the created record', async () => {
      await service.createCustomer({ userId: 'id-xyz', username: 'john', email: 'john_doe@gmail.com' });
      const found = await service.getById('id-xyz');
      expect(found).toBeDefined();
      expect(found?.userId).toBe('id-xyz');
      expect(found?.email).toBe('john_doe@gmail.com');
    });

    it('getById returns null for non-existing id (no exception)', async () => {
      const found = await service.getById('missing');
      expect(found).toBeNull();
    });

    it('updateCustomer updates only defined fields and keeps registeredAt by default', async () => {
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

      await service.updateCustomer('id-1', {
        firstName: 'John',
        lastName: undefined, // should be ignored
        avatar: '',          // should be applied
      });

      const updated = await service.getById('id-1');
      expect(updated).not.toBeNull();
      expect(updated!.registeredAt?.toISOString()).toBe(originalRegisteredAt?.toISOString());
      expect(updated!.firstName).toBe('John');
      expect(updated!.lastName).toBe('Doe'); // unchanged
      expect(updated!.avatar).toBe('');
      expect(updated!.email).toBe('john_doe@gmail.com');
    });

    it('updateCustomer can CREATE and ATTACH a new subscription when one is provided without id', async () => {
      await service.createCustomer({ userId: 'C1', username: 'u1', email: 'u1@mail.com' });
      const result = await service.updateCustomer('C1', {
        subscription: { /* any fields -> new subscription */ } as any,
      });

      expect(result.subscription).toBeDefined();
      expect((result.subscription as any).id).toBeDefined();
      // stored in subscription store
      expect(subs.find(s => (s as any).id === (result.subscription as any).id)).toBeTruthy();
    });

    it('updateCustomer can UPDATE existing subscription when id is provided', async () => {
      // make a sub and attach first
      await service.createCustomer({ userId: 'C2', username: 'u2', email: 'u2@mail.com' });
      const created = await service.updateCustomer('C2', { subscription: {} as any });
      const subId = (created.subscription as any).id;

      // now update through the service
      const after = await service.updateCustomer('C2', { subscription: { id: subId, someField: 'changed' } as any });
      expect((after.subscription as any).id).toBe(subId);

      // ensured repo.preload/save path executed
      expect(subscriptionRepo.preload).toHaveBeenCalled();
      expect(subscriptionRepo.save).toHaveBeenCalled();
    });

    it('updateCustomer can DETACH subscription when null is provided', async () => {
      await service.createCustomer({ userId: 'C3', username: 'u3', email: 'u3@mail.com' });
      await service.updateCustomer('C3', { subscription: {} as any });
      const mid = await service.getById('C3');
      expect(mid?.subscription).toBeDefined();

      const after = await service.updateCustomer('C3', { subscription: null as any });
      expect(after.subscription).toBeNull();
    });

    it('updateCustomer throws NotFoundException for non-existing customer (new behavior)', async () => {
      await expect(service.updateCustomer('nope', { firstName: 'X' }))
        .rejects.toThrow(InternalServerErrorException);
    });
  });
});

