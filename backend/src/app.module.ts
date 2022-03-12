import { CacheModule, Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './components/posts/posts.module';
import { PbEnvModule } from "./config/environments/pb-env.module";
import { PostsResolver } from "./components/posts/post.resolvers";
import { GraphQLModule } from "@nestjs/graphql";
import { PbEnv } from "@pb-config/environments/pb-env.service";
import { WinstonModule } from 'nest-winston';
import { PrismaModule } from '@pb-components/prisma/prisma.module';
import { BucketAssetsModule } from '@pb-components/bucket-assets/bucket-assets.module';
import { ProfileModule } from '@pb-components/profile/profile.module';
import { ImpressionModule } from '@pb-components/impressions/impression.module';
import { ConnectionModule } from './components/connection/connection.module';

@Module({
  imports: [
    PbEnvModule,
    GraphQLModule.forRootAsync({
      inject: [PbEnv],
      useFactory: (env: PbEnv) => env.GqlModuleOptionsFactory,
    }),
    WinstonModule.forRootAsync({
      inject: [PbEnv],
      useFactory: (env: PbEnv) => env.WinstonModuleOptionsFactory,
    }),
    PrismaModule.forRootAsync({
      imports: [WinstonModule],
      inject: [PbEnv],
      isGlobal: true,
      useFactory: (env: PbEnv) => ({
        prismaOptions: env.PrismaOptionsFactory,
      }),
    }),
    BucketAssetsModule,
    CacheModule.register({
      isGlobal: true,
    }),
    PostsModule,
    ProfileModule,
    ImpressionModule,
    ConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService, PostsResolver],
})
export class AppModule { }
