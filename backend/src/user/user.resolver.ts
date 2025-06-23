import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJwtGuard } from '../auth/graphql-jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DemoUser } from '../auth/demo-token.service';

@Resolver()
export class UserResolver {
  /**
   * Get user profile information
   */
  @Query(() => String, {
    description: 'Get detailed user profile information',
  })
  @UseGuards(GraphQLJwtGuard)
  getUserProfile(@CurrentUser() user: DemoUser): string {
    const profile = {
      id: user.sub,
      email: user.email,
      name: user.name,
      roles: user.roles,
      tokenIssuedAt: new Date(user.iat * 1000).toISOString(),
    };

    return JSON.stringify(profile, null, 2);
  }

  /**
   * Check if user has specific role
   */
  @Query(() => Boolean, {
    description: 'Check if current user has a specific role',
  })
  @UseGuards(GraphQLJwtGuard)
  hasRole(@Args('role') role: string, @CurrentUser() user: DemoUser): boolean {
    return user.roles.includes(role);
  }

  /**
   * Get user permissions based on roles
   */
  @Query(() => [String], {
    description: 'Get user permissions based on their roles',
  })
  @UseGuards(GraphQLJwtGuard)
  getUserPermissions(@CurrentUser() user: DemoUser): string[] {
    const permissions: string[] = [];

    if (user.roles.includes('user')) {
      permissions.push('read:profile', 'update:profile');
    }

    if (user.roles.includes('admin')) {
      permissions.push(
        'read:all_users',
        'update:all_users',
        'delete:users',
        'manage:system',
      );
    }

    return permissions;
  }

  /**
   * Update user preferences (demo mutation)
   */
  @Mutation(() => String, {
    description: 'Update user preferences',
  })
  @UseGuards(GraphQLJwtGuard)
  updateUserPreferences(
    @CurrentUser() user: DemoUser,
    @Args('theme', { nullable: true }) theme?: string,
    @Args('language', { nullable: true }) language?: string,
  ): string {
    const updates: string[] = [];

    if (theme) updates.push(`theme: ${theme}`);
    if (language) updates.push(`language: ${language}`);

    return `Preferences updated for ${user.name} (${user.email}): ${updates.join(', ')}`;
  }

  /**
   * Admin-only: Get all users summary
   */
  @Query(() => String, {
    description: 'Admin-only: Get summary of all users in the system',
  })
  @UseGuards(GraphQLJwtGuard)
  getAllUsersAdmin(@CurrentUser() user: DemoUser): string {
    if (!user.roles.includes('admin')) {
      throw new Error('Access denied. Admin role required.');
    }

    // Mock data for demonstration
    const usersSummary = {
      totalUsers: 42,
      activeUsers: 38,
      adminUsers: 3,
      regularUsers: 39,
      lastLogin: new Date().toISOString(),
    };

    return JSON.stringify(usersSummary, null, 2);
  }
}
