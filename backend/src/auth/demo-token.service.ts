import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface DemoUser {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  iat: number;
}

@Injectable()
export class DemoTokenService {
  private readonly secret = 'demo-secret-key-123';
  private readonly expiresIn = '24h';

  /**
   * Generate a demo JWT token with predefined user data
   */
  generateDemoToken(): string {
    const demoUser: DemoUser = {
      sub: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User',
      roles: ['user', 'admin'],
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(demoUser, this.secret, { expiresIn: this.expiresIn });
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): DemoUser {
    try {
      return jwt.verify(token, this.secret) as DemoUser;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get the secret key for verification (used by guards)
   */
  getSecret(): string {
    return this.secret;
  }

  /**
   * Generate a custom token with specific user data
   */
  generateCustomToken(userData: Partial<DemoUser>): string {
    const customUser: DemoUser = {
      sub: userData.sub || 'custom-user-' + Date.now(),
      email: userData.email || 'custom@example.com',
      name: userData.name || 'Custom User',
      roles: userData.roles || ['user'],
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(customUser, this.secret, { expiresIn: this.expiresIn });
  }
}
