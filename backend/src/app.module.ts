import { Inject, Module } from '@nestjs/common';
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
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PostsResolver],
})
export class AppModule { }
