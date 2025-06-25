import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './patient/patient.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { TraceInterceptor } from './common/interceptors/trace.interceptor';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CustomThrottleGuard } from './common/guards/custom.throttle.guard';

interface GraphQLRequest {
  headers?: {
    authorization?: string;
  };
  user?: unknown;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env.APP_ENV === 'local',
      introspection: process.env.APP_ENV === 'local',
      context: ({ req }: { req: GraphQLRequest }) => ({ req }), // Pass request object to GraphQL context for authentication
    }),
    DatabaseModule,
    PatientModule,
    AuthModule,
    UserModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottleGuard,
    },
  ],
})
export class AppModule {}
