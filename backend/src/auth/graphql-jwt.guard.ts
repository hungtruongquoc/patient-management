import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DemoTokenService } from './demo-token.service';

interface RequestWithUser {
  user?: any;
  headers?: {
    authorization?: string;
  };
}

interface GraphQLContext {
  req: RequestWithUser;
}

@Injectable()
export class GraphQLJwtGuard implements CanActivate {
  constructor(private readonly demoTokenService: DemoTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    // Convert to GraphQL execution context
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<GraphQLContext>();

    // Extract token from Authorization header
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify token and attach user to request
      const user = this.demoTokenService.verifyToken(token);
      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: RequestWithUser): string | undefined {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      return undefined;
    }

    const parts = authHeader.split(' ');
    const [type, token] = parts;
    return type === 'Bearer' ? token : undefined;
  }
}

/**
 * Optional guard for role-based access control
 */
@Injectable()
export class GraphQLRoleGuard implements CanActivate {
  constructor(
    private readonly demoTokenService: DemoTokenService,
    private readonly requiredRoles: string[],
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<GraphQLContext>();

    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const user = this.demoTokenService.verifyToken(token);
      req.user = user;

      // Check if user has required roles
      const hasRequiredRole = this.requiredRoles.some(role =>
        user.roles.includes(role),
      );

      if (!hasRequiredRole) {
        throw new UnauthorizedException(
          `Access denied. Required roles: ${this.requiredRoles.join(', ')}`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: RequestWithUser): string | undefined {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      return undefined;
    }

    const parts = authHeader.split(' ');
    const [type, token] = parts;
    return type === 'Bearer' ? token : undefined;
  }
}
