import { Module } from '@nestjs/common';
import { DemoTokenService } from './demo-token.service';
import { GraphQLJwtGuard } from './graphql-jwt.guard';
import { AuthResolver } from './auth.resolver';

@Module({
  providers: [DemoTokenService, GraphQLJwtGuard, AuthResolver],
  exports: [DemoTokenService, GraphQLJwtGuard],
})
export class AuthModule {}
