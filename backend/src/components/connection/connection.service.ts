import { Injectable } from "@nestjs/common";
import { Node, PageInfoModel } from "./interfaces/pagenation";
import { ConnectionArgs } from "./interfaces/pagination.args";

@Injectable()
export class ConnectionService {

  pageInfo(args: ConnectionArgs, nodes: Node[]): PageInfoModel {
    if (!args.first && !args.last) {
      throw new Error('first or last is need.');
    }

    const hasNextPage: boolean = (() => {
      if (args.first) {
        return args.first === nodes.length;
      } else {
        return !!args.cursor;
      }
    })();

    const hasPreviousPage: boolean = (() => {
      if (args.first) {
        return !!args.cursor;
      } else {
        return args.last === nodes.length;
      }
    })();

    return {
      startCursor: nodes?.[0]?.id,
      endCursor: nodes?.[nodes.length - 1]?.id,
      hasNextPage,
      hasPreviousPage,
    };
  }
}