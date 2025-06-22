import { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';

export const getGraphQLConfig = (
  configService: ConfigService,
): ApolloDriverConfig => {
  const isLocal = configService.get('APP_ENV') === 'local';

  return {
    autoSchemaFile: true,
    playground: isLocal,
    introspection: isLocal,
  };
};
