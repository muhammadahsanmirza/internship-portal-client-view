/* eslint-disable react/prop-types */


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function DeleteDialog({ title, noCallback, yesCallback, open }) {
  console.log("Delete Dialog Status", open);
  return (
    <Dialog
      open={open}
      onClose={noCallback}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs" // Adjust this for different sizes like 'md', 'lg', etc.
      PaperProps={{
        sx: {
          borderRadius: 1, // Rounds the corners
          width: "400px", // You can adjust this width as per your needs
          maxWidth: "100%",
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          backgroundColor: "#F5F5F5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 1,
          fontWeight: "bold",
          height:"60px",
          padding: "0px 10px 0px 20px",
        }}
      >
        Delete {title}?
        <IconButton aria-label="close" onClick={noCallback} sx={{ color: "black" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "white",
          color: "gray",
          textAlign: "left",
          margin:"20px 0px",
          padding: "0px 22px",
        }}
      >
        {"This can't be undone"}
      </DialogContent>
            <DialogActions sx={{ justifyContent: "end", padding: "10px 20px" ,borderTop: "2px solid lightGray",}}>
      <Button
          onClick={noCallback}
          sx={{
            backgroundColor: "white",
            color: "black",
            border: "2px solid gray",
            fontWeight: "bold",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={yesCallback}
          sx={{
            backgroundColor: "#CC0000",
            color: "white",
            border: "2px solid #CC0000",
            fontWeight: "bold",
          }}
        >
          Delete
        </Button>
        
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
