import {Int, Query, Resolver} from '@nestjs/graphql';
import {ConfigService} from "@nestjs/config";
import {PbEnv} from "../../config/environments/pb-env.service";
import {PostModel} from "@pb-components/posts/interfaces/post.model";
import {PrismaService} from "@pb-components/prisma/prisma.service";

@Resolver((of) => PostModel)
export class PostsResolver {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  @Query(() => [PostModel], { name: 'posts', nullable: true })
  async getPosts() {
    return [
      {
        id: '1',
        title: 'NestJS is so good.',
      },
      {
        id: '2',
        title: 'GraphQL is so good.',
      },
    ];
  }

  @Query(() => [PostModel], { name: 'prismaPosts', nullable: true })
  async getPostsByPrisma() {
    return this.prisma.post.findMany();
  }
}