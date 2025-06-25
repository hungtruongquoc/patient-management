import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { AppLogger } from '../logging/app-logger';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter, GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType<'http' | 'graphql'>();

    // Log the exception with trace ID
    this.logException(exception, contextType);

    if (contextType === 'graphql') {
      // For GraphQL, let the framework handle the response
      // Just log and re-throw so GraphQL can format it properly
      return exception;
    } else {
      // For HTTP requests, handle normally
      this.handleHttpException(exception, host);
    }
  }

  private logException(exception: unknown, contextType: string) {
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.message
      : exception instanceof Error
      ? exception.message
      : 'Unknown error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    // Log based on severity
    if (status >= 500) {
      AppLogger.error('Unhandled exception occurred', {
        contextType,
        status,
        message,
        stack,
        exceptionType: exception?.constructor?.name || 'Unknown',
      });
    } else if (status >= 400) {
      AppLogger.warn('Client error occurred', {
        contextType,
        status,
        message,
        exceptionType: exception?.constructor?.name || 'Unknown',
      });
    } else {
      AppLogger.info('Exception handled', {
        contextType,
        status,
        message,
        exceptionType: exception?.constructor?.name || 'Unknown',
      });
    }
  }

  private handleHttpException(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.getResponse()
      : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
