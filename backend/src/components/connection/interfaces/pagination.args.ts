import { Field, ID, Int, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class ConnectionArgs {
  @Field((type) => ID, { nullable: true })
  cursor?: string;

  @Field((type) => Int, { nullable: true })
  first?: number;

  @Field((type) => Int, { nullable: true })
  last?: number;
}
