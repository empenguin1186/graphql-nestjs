import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PostModel } from "@pb-components/posts/interfaces/post.model";
import { PrismaService } from "@pb-components/prisma/prisma.service";
import { GetPostsArgs } from './interfaces/get-posts-connection.args';
import { FindPostArgs } from './interfaces/find-post-args';
import { GoogleStorageRepository } from '@pb-components/bucket-assets/repositories/google-storage.repository';
import matter from 'gray-matter';
import { ImpressionModel } from '@pb-components/impressions/interfaces/impression.model';
import { ImpressionService } from '@pb-components/impressions/impression.service';

@Resolver((of) => PostModel)
export class PostsResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gcsRepository: GoogleStorageRepository,
    private readonly impressionService: ImpressionService,
  ) { }

  @Query(() => [PostModel], { name: 'posts', nullable: true })
  async getPosts(@Args() args: GetPostsArgs) {
    return this.prisma.post.findMany({
      where: {
        type: args.type
          ? {
            in: args.type,
          }
          : undefined,
        published: true,
      },
      orderBy: {
        publishDate: 'desc',
      }
    });
  }

  @Query(() => PostModel, { name: 'findPost', nullable: false })
  async findPost(@Args() args: FindPostArgs) {
    return await this.prisma.post.findUnique({
      rejectOnNotFound: true,
      where: {
        id: args.id,
        contentPath: args.contentPath,
      },
    });
  }

  @ResolveField(() => String, { name: 'bodyMarkdown', nullable: false })
  async bodyMarkdown(@Parent() post: PostModel) {
    const { contentPath } = post;
    const markdown = await this.gcsRepository.download(contentPath);
    const { content } = matter(markdown);
    return content;
  }

  @ResolveField(() => [ImpressionModel], { name: 'impressions', nullable: false })
  async impressions(@Parent() post: PostModel) {
    const { id } = post;
    return this.impressionService.search({ postId: id });
  }
}