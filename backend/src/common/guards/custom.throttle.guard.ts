import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql/type';
import { AppLogger } from '../logging/app-logger';

export class CustomThrottleGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx: GqlExecutionContext = GqlExecutionContext.create(context);
    const ctx: { req: Request; res: Response } = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res };
  }

  protected async getTracker(req: Request): Promise<string> {
    // Track by IP address
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const { req: request } = this.getRequestResponse(context);

    const ip = await this.getTracker(request);
    const gqlCtx: GqlExecutionContext = GqlExecutionContext.create(context);
    const info: GraphQLResolveInfo = gqlCtx.getInfo();

    const operationName = info?.operation.name?.value || 'unknown';
    const fieldName = info?.fieldName || 'unknown';
    const userAgent: string | undefined = request.headers['user-agent'];

    AppLogger.warn('Rate limit exceeded', {
      ip,
      userAgent,
      operationName,
      fieldName,
    });

    throw new ThrottlerException('Too many requests');
  }
}
