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
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axiosInstance from "../interceptors/axiosInstance";
import ConfirmationDialog from "./ConfirmDialog";
// Custom theme for Material UI
const theme = createTheme({
  palette: {
    primary: { main: "#172554" }, // Tailwind's blue-950 for the header
    success: { main: "#059669" }, // Tailwind's green-600 for the submit button
    text: { primary: "#374151" }, // Tailwind's gray-400 for form labels
  },
});

//TODO: Clean Code---> Too many college_id unused props

const ProgramFormDialog = ({
  headerText,
  open,
  close,
  onProgramUpdate,
  editMode = false,
  id = null,
  program_name = null,
  status = null,
  description = "",
  coordinators = [],
  college_id = null,
  // college_name = null,
}) => {
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
      college_id: college_id || "",
      description: description || "",
      coordinator: coordinators || [],
    },
  });
  // Snackbar state for success and error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [colleges, setColleges] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCoordinatorId, setNewCoordinatorId] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleCreateCoordinator = () => {
    axiosInstance
      .post(`/program/coordinators/${id}`, null, {
        params: { coordinator_id: newCoordinatorId },
      })
      .then((res) => {
        console.log(res);
        console.log("Coordinator created successfully");
        setSnackbarMessage("Coordinator created successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarMessage("Error creating Coordinator");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      })
      .finally(() => {
        handleCloseConfirmDialog();
        onProgramUpdate();
        setTimeout(() => {
          close();
        }, 800);
      });
  };
  const handleDeleteCoordinator = (coordinatorId) => {
    axiosInstance
      .delete(`/program/coordinator/${id}`, {
        params: { coordinator_id: parseInt(coordinatorId) },
      })
      .then((res) => {
        console.log(res);
        console.log("Coordinator deleted successfully");
        setSnackbarMessage("Coordinator deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackbarMessage("Error deleting Coordinator");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      })
      .finally(() => {
        handleCloseConfirmDialog();
        onProgramUpdate();
        setTimeout(() => {
          close();
        }, 800);
      });
  };
  useEffect(() => {
    axiosInstance
      .get("/college/names")
      .then((res) => {
        console.log("colleges-->", res.data.data);
        setColleges(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
    if (editMode) {
      axiosInstance
        .get("/user/names")
        .then((res) => {
          console.log("users-->", res.data.data);
          setUsers(res.data.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [editMode]);

  const onSubmit = (data) => {
    data.status = data.status === "active";
    console.log(data);
    if (!editMode) {
      axiosInstance
        .post("/program", data)
        .then((res) => {
          setSnackbarMessage(
            res.data.message || "Program created successfully"
          );
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          console.log("Program created successfully", res);
        })
        .catch((err) => {
          setSnackbarMessage("Error creating college");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.log("Error creating Program", err.message);
        })
        .finally(() => {
          setTimeout(() => {
            onProgramUpdate();
            close();
          }, 800);
        });
    }
    if (editMode) {
      data.college_id = id;
      console.log("Put Data-->", data);
      axiosInstance
        .put(`/program/${id}`, data)
        .then((res) => {
          console.log("Inside put edit request ==>", res);
          setSnackbarMessage(res.statusText || "Program updated successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          console.log("Program updated successfully", res);
        })
        .catch((err) => {
          setSnackbarMessage("Error Updating Program");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.log("Error Updating Program", err.message);
        })
        .finally(() => {
          setTimeout(() => {
            onProgramUpdate();
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
            <Stack spacing={2}>
              {/* Program Name Input */}
              <Stack direction="row" spacing={2}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Program Name is required",
                    pattern: {
                      value: /^(?=.*[A-Za-z])[\S\sA-Za-z0-9]*$/,
                      message:
                        "Program Name cannot be only numbers or special characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Program Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name ? errors.name.message : ""}
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
              </Stack>

              {/* College  Dropdown */}
              {!editMode && (
                <FormControl fullWidth error={!!errors.college_id}>
                  <InputLabel id="college-label" sx={{ color: "#44403c" }}>
                    College Name
                  </InputLabel>
                  <Controller
                    name="college_id"
                    control={control}
                    rules={{ required: "College Name is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="college-name-label"
                        id="college-name-select"
                        label="College Name"
                        sx={{
                          color: "#44403c",
                          "& .MuiSvgIcon-root": { color: "#44403c" },
                          width: "50%",
                        }}
                      >
                        <MenuItem value="">
                          <em>College Name</em>
                        </MenuItem>
                        {colleges?.map((college) => (
                          <MenuItem
                            key={college.id}
                            value={college.id}
                            sx={{ color: "#44403c" }}
                          >
                            {college.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.college_id && (
                    <p style={{ color: "#d32f2f" }} className="mx-4 text-sm">
                      {errors.college_id.message}
                    </p>
                  )}
                </FormControl>
              )}

              {/* Full-Width Description Field */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    name="description"
                    label="Description"
                    multiline
                    rows={2}
                    variant="outlined"
                    fullWidth
                    error={!!errors.collegeName}
                    helperText={
                      errors.collegeName ? errors.collegeName.message : ""
                    }
                    sx={{
                      color: "#44403c",
                      "& .MuiInputLabel-root": { color: "#9CA3AF" },
                      "& .MuiOutlinedInput-root": { color: "#44403c" },
                    }}
                  />
                )}
              />

              {/* Coordinator List (conditionally rendered) */}
              {editMode && (
                <div>
                  <InputLabel id="coordinator-label" sx={{ color: "#44403c" }}>
                    Coordinators:
                  </InputLabel>
                  {coordinators?.map((coordinator) => (
                    <Chip
                      key={coordinator.user_id}
                      label={coordinator.user_name}
                      size="medium"
                      variant="outlined"
                      color="info"
                      onDelete={() =>
                        handleDeleteCoordinator(coordinator.user_id)
                      }
                      style={{ margin: "0.2em" }}
                    />
                  ))}
                </div>
              )}

              {/* Coordinator Dropdown */}
              {editMode && (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel id="coordinator-label" sx={{ color: "#44403c" }}>
                    Coordinator
                  </InputLabel>
                  <Controller
                    name="coordinator"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="coordinator-label"
                        id="coordinator-select"
                        value={String(newCoordinatorId)}
                        onChange={(e) => {
                          setNewCoordinatorId(e.target.value);
                          handleOpenConfirmDialog();
                        }}
                        label="coordinator"
                        sx={{
                          color: "#44403c",
                          "& .MuiSvgIcon-root": { color: "#44403c" },
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Coordinator</em>
                        </MenuItem>
                        {users?.map((user) => (
                          <MenuItem
                            key={user.id}
                            value={user.id}
                            sx={{ color: "#44403c" }}
                          >
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              )}
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
      {editMode && openConfirmDialog && (
        <ConfirmationDialog
          modalTitle={"Do You want to add new Coordinator?"}
          open={openConfirmDialog}
          close={() => handleCloseConfirmDialog()}
          confirmOperation={handleCreateCoordinator}
          pathId={id}
          queryId={newCoordinatorId}
        />
      )}
    </ThemeProvider>
  );
};

export default ProgramFormDialog;
