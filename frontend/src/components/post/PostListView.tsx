import { Avatar, Chip, Link, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { PostFragment } from "../../graphql/generated.graphql";
import { isoStringToJstDate } from "../../libs/date";
import { contentUrl } from "../../libs/site";

type Props = {
  posts: PostFragment[];
};

export function PostListView(props: Props): React.ReactElement {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {props.posts.map((post) => (
        <ListItem key={post.id}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: grey[300] }}> {post.emoji} </Avatar>
          </ListItemAvatar>
          <Link href={contentUrl(post.contentPath)}>
            <a>
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
            </a>
          </Link>
        </ListItem>
      ))}
    </List>
  )
}