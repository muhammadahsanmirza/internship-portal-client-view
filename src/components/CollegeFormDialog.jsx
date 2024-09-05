/* eslint-disable react/prop-types */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme for Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#1E3A8A", // Tailwind's blue-950 for the header
    },
    success: {
      main: "#16A34A", // Tailwind's green-600 for the submit button
    },
    text: {
      primary: "#9CA3AF", // Tailwind's gray-400 for form labels
    },
  },
});

const CollegeFormDialog = ({ openDialog, closeDialog }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      collegeName: "",
      status: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission logic here
    closeDialog(); // Close the dialog after submission
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        fullWidth
        PaperProps={{
          style: {
            // backgroundColor: '#1E3A8A', //  Tailwind's blue-950 for the dialog background
            backgroundColor: "white", //  Tailwind's blue-950 for the dialog background
            color: "white",
          },
        }}
        sx={{ backdropFilter: "blur(5px)" }} // Apply blur effect to the background
      >
        {/* Dialog Header */}
        <DialogTitle style={{ backgroundColor: "#172554", color: "white" }}>
          <div className="flex justify-between items-center">
            <span>Create College</span>
            <IconButton onClick={closeDialog} style={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ backgroundColor: "white" }}
          >
            {/* College Name Input */}
            <Controller
              name="collegeName"
              control={control}
              rules={{ required: "College Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="College Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.collegeName}
                  helperText={
                    errors.collegeName ? errors.collegeName.message : ""
                  }
                  sx={{
                    "& .MuiInputLabel-root": { color: "#9CA3AF" }, // Tailwind gray-400 for label
                    "& .MuiOutlinedInput-root": { color: "#44403c" }, // Change text color to Gray
                  }}
                />
              )}
            />

            {/* Status Dropdown */}
            <FormControl fullWidth margin="normal" error={!!errors.status}>
              <InputLabel id="status-label" sx={{ color: "#44403c" }}>
                Status
              </InputLabel>{" "}
              {/* Label in gray-400 */}
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="status-label"
                    id="status-select"
                    label="Status"
                    sx={{
                      color: "#44403c", // Change text color to white
                      "& .MuiSvgIcon-root": { color: "#44403c" }, // Change dropdown arrow color to white
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Status</em>
                    </MenuItem>
                    <MenuItem value="active" sx={{ color: "#44403c" }}>
                      {/* Change text color to #44403c */}
                      Active
                    </MenuItem>
                    <MenuItem value="inactive" sx={{ color: "#44403c" }}>
                      {/* Change text color to #44403c */}
                      Inactive
                    </MenuItem>
                  </Select>
                )}
              />
              {errors.status && (
                <p style={{ color: "red" }}>{errors.status.message}</p>
              )}
            </FormControl>
          </form>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleSubmit(onSubmit)}
          >
            Create College
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default CollegeFormDialog;
