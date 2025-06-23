import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DemoUser } from './demo-token.service';

interface RequestWithUser {
  user: DemoUser;
}

interface GraphQLContext {
  req: RequestWithUser;
}

/**
 * Custom decorator to extract the current authenticated user from GraphQL context
 *
 * Usage:
 * @Query(() => String)
 * async protectedQuery(@CurrentUser() user: DemoUser): Promise<string> {
 *   return `Hello ${user.name}!`;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): DemoUser => {
    // Convert to GraphQL execution context
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<GraphQLContext>();

    // Return the user attached by the JWT guard
    return req.user;
  },
);

/**
 * Decorator to extract specific user property
 *
 * Usage:
 * @Query(() => String)
 * async getUserEmail(@CurrentUser('email') email: string): Promise<string> {
 *   return email;
 * }
 */
export const CurrentUserProperty = createParamDecorator(
  (
    property: keyof DemoUser,
    context: ExecutionContext,
  ): string | string[] | number => {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<GraphQLContext>();

    const user = req.user;
    return property ? user[property] : user.sub;
  },
);
