/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Stack,
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
  Portal,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axiosInstance from "../../interceptors/axiosInstance";
// Custom theme for Material UI
const theme = createTheme({
  palette: {
    primary: { main: "#172554" }, // Tailwind's blue-950 for the header
    success: { main: "#059669" }, // Tailwind's green-600 for the submit button
    text: { primary: "#374151" }, // Tailwind's gray-400 for form labels
  },
});

const MajorFormDialog = ({
  headerText,
  open,
  close,
  onMajorUpdate,
  editMode = false,
  id = null,
  program_name = "",
  status = null,
  program_id = "",
//   description = "",
//   coordinators = [],
//   college_name = null,
}) => {
  console.log("Program Name-->",program_name)
  console.log("Program Id-->",program_id)
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: program_name || "",
      status:
        ((status === true || status === false) &&
          (status ? "active" : "inactive")) ||
        "",
      // program_id: String(program_id) || "",
      program_id: program_id !== null ? String(program_id) : null,
    },
  });
  // Snackbar state for success and error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [programs, setPrograms] = useState([]);


  useEffect(() => {
    axiosInstance
      .get("/program/names")
      .then((res) => {
        setPrograms(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const onSubmit = (data) => {
    data.status = data.status === "active";
    data.program_id = parseInt(data.program_id);
    if (!editMode) {
      axiosInstance
        .post("/major", data)
        .then((res) => {
            console.log("Major creation",res)
          setSnackbarMessage(
            res.data.message || "Major created successfully"
          );
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          console.log("Major created successfully", res);
        })
        .catch((err) => {
          setSnackbarMessage("Error creating Major");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.log("Error creating Major", err.message);
        })
        .finally(() => {
          setTimeout(() => {
            onMajorUpdate();
            close();
          }, 800);
        });
    }
    if (editMode) {
      data.program_id = program_id;
      axiosInstance
        .put(`/major/${id}`, data)
        .then((res) => {
          setSnackbarMessage(res.statusText || "College updated successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        })
        .catch((err) => {
          setSnackbarMessage(err.message || "Error Updating Program");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        })
        .finally(() => {
          setTimeout(() => {
            onMajorUpdate();
            close();
          }, 800);
        });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        PaperProps={{ style: { backgroundColor: "white", color: "black" } }}
        sx={{ backdropFilter: "blur(5px)" }} // Apply blur effect to the background
      >
        {/* Dialog Header */}
        <DialogTitle style={{ backgroundColor: "#172554", color: "white" }}>
          <div className="flex justify-between items-center">
            <span>{headerText}</span>
            <IconButton onClick={close} style={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ backgroundColor: "white", marginTop: "20px" }}
          >

              {/* Major Name Input */}
              <Stack  spacing={2}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Major Name is required",
                    pattern: {
                      value: /^(?=.*[A-Za-z])[\S\sA-Za-z0-9]*$/,
                      message:
                        "Major Name cannot be only numbers or special characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Major Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.name}
                      helperText={
                        errors.name ? errors.name.message : ""
                      }
                      sx={{
                        color: "#44403c",
                        "& .MuiInputLabel-root": { color: "#9CA3AF" },
                        "& .MuiOutlinedInput-root": { color: "#44403c" },
                      }}
                    />
                  )}
                />

                {/* Status Dropdown */}
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel id="status-label" sx={{ color: "#44403c" }}>
                    Status
                  </InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="status-label"
                        id="status-select"
                        label="Status"
                        sx={{
                          color: "#44403c",
                          "& .MuiSvgIcon-root": { color: "#44403c" },
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Status</em>
                        </MenuItem>
                        <MenuItem value="active" sx={{ color: "#44403c" }}>
                          Active
                        </MenuItem>
                        <MenuItem value="inactive" sx={{ color: "#44403c" }}>
                          Inactive
                        </MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>


              {/* Program  Dropdown */}

              <FormControl fullWidth error={!!errors.college_id}>
                <InputLabel id="program-label" sx={{ color: "#44403c" }}>
                  Program Name
                </InputLabel>
                <Controller
                  name="program_id"
                  control={control}
                  rules={{ required: "Program Name is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="program-name-label"
                      id="program-name-select"
                      label="Program Name"
                      sx={{
                        color: "#44403c",
                        "& .MuiSvgIcon-root": { color: "#44403c" },
                      }}
                    >
                      <MenuItem value="">
                        <em>Program Name</em>
                      </MenuItem>
                      {programs?.map((program) => (
                        <MenuItem
                          key={program.id}
                          value={program.id}
                          sx={{ color: "#44403c" }}
                        >
                          {program.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.program_id && (
                  <p style={{ color: "#d32f2f" }} className="mx-4 text-sm">
                    {errors.program_id.message}
                  </p>
                )}
              </FormControl>
            </Stack>
          </form>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ borderTop: "1px solid #ccc" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleSubmit(onSubmit)}
          >
            {headerText}
          </Button>
        </DialogActions>
      </Dialog>

      <Portal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ zIndex: 9999 }} // You can still add a high z-index
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Portal>
    </ThemeProvider>
  );
};

export default MajorFormDialog;
