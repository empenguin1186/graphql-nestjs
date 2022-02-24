export declare class PostsResolver {
    constructor();
    getPosts(): Promise<{
        id: string;
        title: string;
    }[]>;
}
