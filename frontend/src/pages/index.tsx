import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import type { GetServerSideProps, NextPage } from 'next'
import { PostListView } from '../components/post/PostListView';
import { PostFragment, PostIndexPageDocument } from '../graphql/generated.graphql';
import { urqlClient } from '../libs/gql-requests';

type Props = {
  articles: PostFragment[];
  diaries: PostFragment[];
};

const Home: NextPage<Props> = (props) => {
  return (
    <Stack
      sx={{
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4">Articles</Typography>
      <PostListView posts={props.articles} />
      <Typography variant="h4">Diaries</Typography>
      <PostListView posts={props.diaries} />

      <Box
        sx={{
          bgColor: "palette.primary.dark",
          backgroundColor: (theme) => theme.palette.primary.dark,
          color: (theme) =>
            theme.palette.getContrastText(theme.palette.primary.dark),
          py: 3,
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <footer>
          <a
            href="http://devcon.hakoika.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Hakodate
          </a>
        </footer>
      </Box>
    </Stack>
  );
};


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const client = await urqlClient();
    const result = await client.query(PostIndexPageDocument, {}).toPromise();

    return {
      props: {
        articles: result.data.articles,
        diaries: result.data.diaries,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    }
  }
};

export default Home