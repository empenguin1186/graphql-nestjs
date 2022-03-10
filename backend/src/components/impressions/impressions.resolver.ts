import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImpressionService } from './impression.service';
import { GetImpressionsArgs } from './interfaces/get-impressions.args';
import { ImpressionModel } from './interfaces/impression.model';

@Resolver((of) => ImpressionModel)
export class ImpressionResolver {
  constructor(private service: ImpressionService) { }

  @Query(() => [ImpressionModel], { name: 'impressions', nullable: true })
  async getImpressions(@Args() args: GetImpressionsArgs) {
    return this.service.search(args);
  }
}