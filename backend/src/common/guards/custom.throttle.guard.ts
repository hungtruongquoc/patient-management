import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql/type';
import { AppLogger } from '../logging/app-logger';

@Injectable()
export class CustomThrottleGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const contextType = context.getType<'http' | 'graphql'>();

    if (contextType === 'graphql') {
      const gqlCtx: GqlExecutionContext = GqlExecutionContext.create(context);
      const ctx: { req: Request; res: Response } = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.res };
    } else {
      // HTTP context
      const req = context.switchToHttp().getRequest<Request>();
      const res = context.switchToHttp().getResponse<Response>();
      return { req, res };
    }
  }

  protected async getTracker(req: Request): Promise<string> {
    // Track by IP address
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const { req: request } = this.getRequestResponse(context);
    const contextType = context.getType<'http' | 'graphql'>();

    const ip = await this.getTracker(request);
    const userAgent: string | undefined = request.headers['user-agent'];

    let operationName = 'unknown';
    let fieldName = 'unknown';

    if (contextType === 'graphql') {
      const gqlCtx: GqlExecutionContext = GqlExecutionContext.create(context);
      const info: GraphQLResolveInfo = gqlCtx.getInfo();
      operationName = info?.operation.name?.value || 'unknown';
      fieldName = info?.fieldName || 'unknown';
    } else {
      // For HTTP requests, use the route path
      operationName = request.method || 'unknown';
      fieldName = request.url || 'unknown';
    }

    AppLogger.warn('Rate limit exceeded', {
      ip,
      userAgent,
      operationName,
      fieldName,
      contextType,
    });

    throw new ThrottlerException('Too many requests');
  }
}
