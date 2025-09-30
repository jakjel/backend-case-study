import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ApplicationService } from './data/data.application.service';
import { CreateCustomerDTO } from './model/customer-create.dto';
import { UpdateCustomerDTO } from './model/customer-update.dto';
import { CustomerResponseDTO } from './model/customer-response.dto';

describe('AppController', () => {
  let appController: AppController;
  let applicationService: ApplicationService;

  const mockCustomerResponse: CustomerResponseDTO = {
    userId: 'user-id-123',
    username: 'john_doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://example.com/avatar.jpg',
    birthday: new Date('1990-01-01'),
    registeredAt: new Date('2023-01-01'),
  };

  const mockCreateCustomerDTO: CreateCustomerDTO = {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://example.com/avatar.jpg',
    birthday: new Date('1990-01-01'),
  };

  const mockUpdateCustomerDTO: UpdateCustomerDTO = {
    username: 'john_doe',
    firstName: 'Johnny',
    lastName: 'Smith',
    avatar: 'https://example.com/avatar.jpg',
    birthday: new Date('1990-01-01'),
  };

  const mockApplicationService = {
    fetchAll: jest.fn(),
    getById: jest.fn(),
    createCustomer: jest.fn(),
    updateCustomer: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: ApplicationService,
          useValue: mockApplicationService,
        },
      ],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    applicationService = moduleRef.get<ApplicationService>(ApplicationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAll', () => {
    it('should return an array of customers', async () => {
      // Arrange
      const expectedResult = [mockCustomerResponse];
      mockApplicationService.fetchAll.mockResolvedValue(expectedResult);

      // Act
      const result = await appController.fetchAll();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(applicationService.fetchAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array', async () => {
      // Arrange
      const expectedResult: CustomerResponseDTO[] = [];
      mockApplicationService.fetchAll.mockResolvedValue(expectedResult);

      // Act
      const result = await appController.fetchAll();

      // Assert
      expect(result).toEqual([]);
      expect(applicationService.fetchAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a customer by ID', async () => {
      // Arrange
      const customerId = 'user-id-123';
      mockApplicationService.getById.mockResolvedValue(mockCustomerResponse);

      // Act
      const result = await appController.getById(customerId);

      // Assert
      expect(result).toEqual(mockCustomerResponse);
      expect(applicationService.getById).toHaveBeenCalledWith(customerId);
      expect(applicationService.getById).toHaveBeenCalledTimes(1);
    });

    it('should test service errors', async () => {
      // Arrange
      const customerId = 'non-existent-id';
      const error = new Error('Customer not found');
      mockApplicationService.getById.mockRejectedValue(error);

      // Act & Assert
      await expect(appController.getById(customerId)).rejects.toThrow('Customer not found');
      expect(applicationService.getById).toHaveBeenCalledWith(customerId);
    });
  });

  describe('createCustomer', () => {
    it('should create and return a new customer', async () => {
      // Arrange
      mockApplicationService.createCustomer.mockResolvedValue(mockCustomerResponse);

      // Act
      const result = await appController.createCustomer(mockCreateCustomerDTO);

      // Assert
      expect(result).toEqual(mockCustomerResponse);
      expect(applicationService.createCustomer).toHaveBeenCalledWith(mockCreateCustomerDTO);
      expect(applicationService.createCustomer).toHaveBeenCalledTimes(1);
    });

    it('should test creation errors', async () => {
      // Arrange
      const error = new Error('Email already exists');
      mockApplicationService.createCustomer.mockRejectedValue(error);

      // Act & Assert
      await expect(appController.createCustomer(mockCreateCustomerDTO)).rejects.toThrow('Email already exists');
      expect(applicationService.createCustomer).toHaveBeenCalledWith(mockCreateCustomerDTO);
    });
  });

  describe('update', () => {
    it('should update and return the customer', async () => {
      // Arrange
      const customerId = 'user-id-123';
      const updatedCustomer = { ...mockCustomerResponse, firstName: 'Johnny', lastName: 'Smith' };
      mockApplicationService.updateCustomer.mockResolvedValue(updatedCustomer);

      // Act
      const result = await appController.update(customerId, mockUpdateCustomerDTO);

      // Assert
      expect(result).toEqual(updatedCustomer);
      expect(applicationService.updateCustomer).toHaveBeenCalledWith(customerId, mockUpdateCustomerDTO);
      expect(applicationService.updateCustomer).toHaveBeenCalledTimes(1);
    });

    it('should handle partial updates', async () => {
      // Arrange
      const customerId = 'user-id-123';
      const partialUpdate: UpdateCustomerDTO = {
        firstName: 'Johnny',
        username: '',
        avatar: '',
        birthday: new Date('1990-01-01'),
        lastName: ''
      };
      const updatedCustomer = { ...mockCustomerResponse, firstName: 'Johnny' };
      mockApplicationService.updateCustomer.mockResolvedValue(updatedCustomer);

      // Act
      const result = await appController.update(customerId, partialUpdate);

      // Assert
      expect(result).toEqual(updatedCustomer);
      expect(applicationService.updateCustomer).toHaveBeenCalledWith(customerId, partialUpdate);
    });

    it('should test update errors', async () => {
      // Arrange
      const customerId = 'non-existent-id';
      const error = new Error('Customer not found');
      mockApplicationService.updateCustomer.mockRejectedValue(error);

      // Act & Assert
      await expect(appController.update(customerId, mockUpdateCustomerDTO)).rejects.toThrow('Customer not found');
      expect(applicationService.updateCustomer).toHaveBeenCalledWith(customerId, mockUpdateCustomerDTO);
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple operations in sequence', async () => {
      // Arrange
      const customers = [mockCustomerResponse];
      mockApplicationService.fetchAll.mockResolvedValue(customers);
      mockApplicationService.getById.mockResolvedValue(mockCustomerResponse);

      // Act
      const allCustomers = await appController.fetchAll();
      const singleCustomer = await appController.getById(mockCustomerResponse.userId);

      // Assert
      expect(allCustomers).toEqual(customers);
      expect(singleCustomer).toEqual(mockCustomerResponse);
      expect(applicationService.fetchAll).toHaveBeenCalledTimes(1);
      expect(applicationService.getById).toHaveBeenCalledTimes(1);
    });
  });
});