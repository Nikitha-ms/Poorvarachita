import { Delete } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import { FeedContext } from "../../Contexts/FeedContext";
import { LoadingContext } from "../../Contexts/LoadingContext";

const draggedStyle = {
  border: "2px dashed #000",
  backgroundColor: "rgba(0,0,0,.05)",
};

function PostForm() {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [dragging, setDragging] = useState(false);

  const { createPost } = useContext(FeedContext);
  const { setLoading } = useContext(LoadingContext);

  // eslint-disable-next-line no-unused-vars
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragover" || e.type === "dragenter") {
      setDragging(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const dt = e.dataTransfer;
    const newFiles = dt.files;

    setFiles([...files, ...newFiles]);
  };

  const handleTextChange = (e) => {
    setDescription(e.target.value);
  };

  const validate = () => {
    if (description.length === 0 || files.length === 0) {
      enqueueSnackbar("Please add some description with some files ", {
        variant: "info",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("description", description);

    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await createPost(formData);

    if (res.success) {
      enqueueSnackbar("Post created successfully", {
        variant: "success",
      });
      setFiles([]);
      setDescription("");
    } else {
      enqueueSnackbar(res.error, {
        variant: "error",
      });
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <Paper
        elevation={3}
        sx={{
          p: 1,
        }}
      >
        <Typography variant="h5">Create Post</Typography>
        <form onDragEnter={handleDrag} onSubmit={handleSubmit}>
          <TextField
            id="outlined-multiline-static"
            label="Document description"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={description}
            onChange={handleTextChange}
            sx={{
              mb: 1,
            }}
          />
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            style={dragging ? draggedStyle : {}}
          >
            <input
              type="file"
              id="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="file">
              <Button
                variant="raised"
                component="span"
                fullWidth
                color="secondary"
                sx={{
                  p: 1,
                  py: 3,
                  border: "2px dashed #ccc",

                  "&:focus": {
                    border: "2px dashed #000",
                    backgroundColor: "rgba(0,0,0,.05)",
                  },
                }}
              >
                Upload Files
              </Button>
            </label>
          </div>
          {files.length > 0 && (
            <List
              sx={{
                p: 0,
                mt: 1,
              }}
            >
              {files.map((file) => (
                <div key={file.name}>
                  {file.name}
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFiles(files.filter((f) => f.name !== file.name));
                    }}
                  >
                    <Delete
                      sx={{
                        color: "red",
                      }}
                    />
                  </IconButton>
                </div>
              ))}
            </List>
          )}

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 1 }}
            color="secondary"
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}

export default PostForm;
