import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DemoTokenService, DemoUser } from './demo-token.service';
import { GraphQLJwtGuard } from './graphql-jwt.guard';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly demoTokenService: DemoTokenService) {}

  /**
   * Public query - generates a demo JWT token
   * No authentication required
   */
  @Query(() => String, {
    description: 'Generate a demo JWT token for testing authentication',
  })
  getDemoToken(): string {
    return this.demoTokenService.generateDemoToken();
  }

  /**
   * Public query - accessible without authentication
   */
  @Query(() => String, {
    description: 'Public endpoint accessible without authentication',
  })
  publicQuery(): string {
    return 'This is a public query accessible to everyone!';
  }

  /**
   * Protected query - requires valid JWT token
   */
  @Query(() => String, {
    description: 'Protected endpoint requiring valid JWT token',
  })
  @UseGuards(GraphQLJwtGuard)
  protectedQuery(@CurrentUser() user: DemoUser): string {
    return `Hello ${user.name}! This is a protected query. Your email is ${user.email}.`;
  }

  /**
   * Get current user information
   */
  @Query(() => String, {
    description: 'Get current authenticated user information',
  })
  @UseGuards(GraphQLJwtGuard)
  getCurrentUser(@CurrentUser() user: DemoUser): string {
    return JSON.stringify(
      {
        id: user.sub,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      null,
      2,
    );
  }

  /**
   * Get user roles
   */
  @Query(() => [String], {
    description: 'Get current user roles',
  })
  @UseGuards(GraphQLJwtGuard)
  userRoles(@CurrentUser() user: DemoUser): string[] {
    return user.roles;
  }

  /**
   * Protected mutation - demonstrates authenticated mutations
   */
  @Mutation(() => String, {
    description: 'Protected mutation requiring authentication',
  })
  @UseGuards(GraphQLJwtGuard)
  updateProfile(
    @Args('name') name: string,
    @CurrentUser() user: DemoUser,
  ): string {
    return `Profile updated! Hello ${name}, your previous name was ${user.name}. User ID: ${user.sub}`;
  }

  /**
   * Generate custom token with specific user data
   */
  @Mutation(() => String, {
    description: 'Generate a custom JWT token with specific user data',
  })
  generateCustomToken(
    @Args('email', { nullable: true }) email?: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('roles', { type: () => [String], nullable: true }) roles?: string[],
  ): string {
    const userData: Partial<DemoUser> = {};

    if (email) userData.email = email;
    if (name) userData.name = name;
    if (roles) userData.roles = roles;

    return this.demoTokenService.generateCustomToken(userData);
  }

  /**
   * Admin-only query (demonstrates role-based access)
   */
  @Query(() => String, {
    description: 'Admin-only endpoint demonstrating role-based access',
  })
  @UseGuards(GraphQLJwtGuard)
  adminOnlyQuery(@CurrentUser() user: DemoUser): string {
    if (!user.roles.includes('admin')) {
      throw new Error('Access denied. Admin role required.');
    }
    return `Welcome admin ${user.name}! You have admin access.`;
  }
}
