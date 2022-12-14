import { Grid, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { FeedContext } from "../../Contexts/FeedContext";
import { UserContext } from "../../Contexts/UserContext";
import Post from "./Post";
import PostForm from "./PostForm";

function Mid() {
  const { userData } = useContext(UserContext);
  const { getPosts, feedPosts } = useContext(FeedContext);

  useEffect(() => {
    getPosts()
      .then((res) => {
        if (!res.success) {
          console.log(res.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <Grid
      item
      xs={12}
      md={7}
      sx={{
        height: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
    >
      <Grid container direction={"column"}>
        <PostForm />
        {feedPosts &&
          feedPosts.map((post) => <Post key={post._id} post={post} />)}
      </Grid>
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          mt: 2,
          color: "text.secondary",
        }}
      >
        No more posts in the feed
      </Typography>
    </Grid>
  );
}

export default Mid;
