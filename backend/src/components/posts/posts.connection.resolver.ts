import { Query } from "@nestjs/common";
import { Args, Resolver } from "@nestjs/graphql";
import { ConnectionService } from "@pb-components/connection/connection.service";
import { PrismaService } from "@pb-components/prisma/prisma.service";
import { GetPostsConnectionArgs } from "./interfaces/get-posts-connection.args";
import { PostsConnection } from "./interfaces/post.model";

@Resolver((of) => PostsConnection)
export class PostsConnectionResolver {

  constructor(
    private prisma: PrismaService,
    private connection: ConnectionService,
  ) { }

  @Query(() => PostsConnection, { name: 'postsConnection', nullable: true })
  async getPostsConnection(@Args() args: GetPostsConnectionArgs) {
    const firstOrLast: number = (() => {
      if (!args.first && !args.last) {
        throw new Error('first or last is need.');
      }
      return args.first || -args.last;
    })();

    const posts = await this.prisma.post.findMany({
      where: {
        type: args.type
          ? {
            in: args.type,
          } : undefined,
        published: true,
      },
      orderBy: {
        publishDate: 'desc',
      },
      cursor: args.cursor
        ? {
          id: args.cursor,
        } : undefined,
      take: firstOrLast,
      skip: args.cursor ? 1 : undefined,
    });

    const pageInfo = this.connection.pageInfo(args, posts);
    return {
      pageInfo,
      nodes: posts,
    }
  }
}