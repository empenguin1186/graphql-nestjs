import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PostModel } from "@pb-components/posts/interfaces/post.model";
import { PrismaService } from "@pb-components/prisma/prisma.service";
import { GetPostsArgs } from './interfaces/get-posts-connection.args';
import { FindPostArgs } from './interfaces/find-post-args';
import { GoogleStorageRepository } from '@pb-components/bucket-assets/repositories/google-storage.repository';
import matter from 'gray-matter';

@Resolver((of) => PostModel)
export class PostsResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gcsRepository: GoogleStorageRepository,
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
    // const markdown = '```kt:build.gradle.kts\nimport com.google.protobuf.gradle.*\nimport org.jetbrains.kotlin.gradle.tasks.KotlinCompile\n\nplugins {\n  id("org.springframework.boot") version "2.4.4"\n  kotlin("jvm") version "1.4.30"\n  kotlin("plugin.spring") version "1.4.30"\n  id("com.google.protobuf") version "0.8.8"\n  id("idea")\n  id("java")\n}\n\ngroup = "jp.co.emperor.penguin"\nversion = "0.0.1-SNAPSHOT"\njava.sourceCompatibility = JavaVersion.VERSION_11\n\nrepositories {\n  mavenCentral()\n}\n\ndependencies {\n  implementation("org.springframework.boot:spring-boot-starter-web")\n  implementation("org.jetbrains.kotlin:kotlin-reflect")\n  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")\n  implementation(platform(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES))\n  implementation("com.google.protobuf:protobuf-java:3.6.1")\n  implementation("io.grpc:grpc-stub:1.15.1")\n  implementation("io.grpc:grpc-protobuf:1.15.1")\n  implementation("io.github.lognet:grpc-spring-boot-starter:4.4.5")\n}\n\nval springBootVersion = "2.4.4"```';
    const { content } = matter(markdown);
    return content;
  }
}