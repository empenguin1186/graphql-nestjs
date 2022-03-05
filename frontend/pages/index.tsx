import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import type { GetServerSideProps, NextPage } from 'next'
import { PostIndexPageDocument, PostModel } from '../src/graphql/generated.graphql';
import { isoStringToJstDate } from '../src/libs/date';
import { urqlClient } from '../src/libs/gql-requests';

type Props = {
  posts: PostModel[];
};

const Home: NextPage<Props> = (props) => {
  return (
    <Stack
      sx={{
        minHeight: "100vh",
      }}
    >
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {props.posts.map((post) => (
          <ListItem key={post.id}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: grey[300] }}> {post.emoji} </Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={post.title}
              secondary={
                <Stack direction="row" spacing={2}>
                  <Chip size="small" color="warning" label={post.type} />
                  <Typography>{isoStringToJstDate(post.publishDate)}</Typography>
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
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
        posts: result.data.posts,
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
