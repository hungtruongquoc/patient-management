import { Test, TestingModule } from '@nestjs/testing';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AppLogger } from '../logging/app-logger';

// Mock AppLogger
jest.mock('../logging/app-logger', () => ({
  AppLogger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockArgumentsHost: jest.Mocked<ArgumentsHost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalExceptionFilter],
    }).compile();

    filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);

    // Mock ArgumentsHost
    mockArgumentsHost = {
      getType: jest.fn(),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
    } as any;

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('GraphQL Context', () => {
    it('should log and re-throw exception for GraphQL context', () => {
      const exception = new Error('Test GraphQL error');
      mockArgumentsHost.getType.mockReturnValue('graphql' as any);

      const result = filter.catch(exception, mockArgumentsHost);

      expect(AppLogger.error).toHaveBeenCalledWith(
        'Unhandled exception occurred',
        expect.objectContaining({
          contextType: 'graphql',
          status: 500,
          message: 'Test GraphQL error',
          exceptionType: 'Error',
        }),
      );

      expect(result).toBe(exception);
    });

    it('should log HttpException with appropriate level for GraphQL', () => {
      const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      mockArgumentsHost.getType.mockReturnValue('graphql' as any);

      filter.catch(exception, mockArgumentsHost);

      expect(AppLogger.warn).toHaveBeenCalledWith(
        'Client error occurred',
        expect.objectContaining({
          contextType: 'graphql',
          status: 400,
          message: 'Bad Request',
          exceptionType: 'HttpException',
        }),
      );
    });
  });

  describe('HTTP Context', () => {
    it('should handle HTTP exceptions properly', () => {
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockRequest = {
        url: '/test-endpoint',
      };

      mockArgumentsHost.getType.mockReturnValue('http' as any);
      mockArgumentsHost.switchToHttp.mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      } as any);

      filter.catch(exception, mockArgumentsHost);

      expect(AppLogger.warn).toHaveBeenCalledWith(
        'Client error occurred',
        expect.objectContaining({
          contextType: 'http',
          status: 404,
          message: 'Not Found',
          exceptionType: 'HttpException',
        }),
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          path: '/test-endpoint',
          message: 'Not Found',
        }),
      );
    });
  });
});
