/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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

const CollegeFormDialog = ({
  headerText,
  open,
  close,
  onCollegeUpdate,
  editMode = false,
  id = null,
  status = null,
  college_name = null,
  admins = null,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: college_name || "",
      status:
        ((status === true || status === false) &&
          (status ? "active" : "inactive")) ||
        "",
      admin: "",
    },
  });
  // Snackbar state for success and error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [users, setUsers] = useState([]);
  const [newAdminId, setNewAdminId] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleCreateAdmin = () => {
    axiosInstance
      .post(`/college/admin/${id}`, null, { params: { admin_id: newAdminId } })
      .then((res) => {
        console.log(res);
        console.log("Admin created successfully");
        setSnackbarMessage("Admin created successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarMessage("Error creating admin");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };
  const handleDeleteAdmin = (adminId) => {
    axiosInstance
      .delete(`/college/admin/${id}`, {
        params: { admin_id: parseInt(adminId) },
      })
      .then((res) => {
        console.log(res);
        console.log("Admin deleted successfully");
        setSnackbarMessage("Admin deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackbarMessage("Error deleting admin");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };
  useEffect(() => {
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
    if (!editMode) {
      axiosInstance
        .post("/college", data)
        .then((res) => {
          setSnackbarMessage(res.statusText || "College created successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          console.log("College created successfully", res);
        })
        .catch((err) => {
          setSnackbarMessage("Error creating college");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.log("Error creating college", err.message);
        })
        .finally(() => {
          setTimeout(() => {
            onCollegeUpdate();
            close();
          }, 1000);
        });
    }
    if (editMode) {
      axiosInstance
        .put(`/college/${id}`, data)
        .then((res) => {
          console.log('put -->',res)
          setSnackbarMessage(res.statusText || "College updated successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          console.log("College updated successfully", res);
        })
        .catch((err) => {
          setSnackbarMessage("Error creating college");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          console.log("Error creating college", err.message);
        })
        .finally(() => {
          setTimeout(() => {
            onCollegeUpdate();
            close();
          }, 1000);
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
            style={{ backgroundColor: "white" }}
          >
            {/* College Name Input */}
            <Controller
              name="name"
              control={control}
              rules={{
                required: "College Name is required",
                pattern: {
                  value: /^(?=.*[A-Za-z])[\S\sA-Za-z0-9]*$/,
                  message:
                    "College Name cannot be only numbers or special characters",
                },
              }}
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
                    color: "#44403c",
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
              {errors.status && (
                <p style={{ color: "red" }}>{errors.status.message}</p>
              )}
            </FormControl>
            {/* Admins List */}
            {editMode && (
              <div>
                <InputLabel id="admin-label" sx={{ color: "#44403c" }}>
                  Admins:
                </InputLabel>
                {admins.map((admin) => (
                  <Chip
                    key={admin.user_id}
                    label={admin.user_name}
                    size="medium"
                    variant="outlined"
                    color="info"
                    onDelete={() => handleDeleteAdmin(admin.user_id)}
                    // className="m-10"
                    style={{ margin: "0.2em" }}
                  />
                ))}
              </div>
            )}
            {/* Admins Dropdown */}
            {editMode && (
              <FormControl fullWidth margin="normal" error={!!errors.status}>
                <InputLabel id="admin-label" sx={{ color: "#44403c" }}>
                  Admin
                </InputLabel>
                <Controller
                  name="admin"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="admin-label"
                      id="admin-select"
                      value={String(newAdminId)}
                      onChange={(e) => {
                        setNewAdminId(e.target.value);
                        handleOpenConfirmDialog();
                      }}
                      label="admin"
                      sx={{
                        color: "#44403c",
                        "& .MuiSvgIcon-root": { color: "#44403c" },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Admin</em>
                      </MenuItem>
                      {users.map((user) => (
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
                {errors.status && (
                  <p style={{ color: "red" }}>{errors.status.message}</p>
                )}
              </FormControl>
            )}
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
          modalTitle={"Do You want to add new Admin?"}
          open={openConfirmDialog}
          close={() => handleCloseConfirmDialog()}
          confirmOperation={handleCreateAdmin}
          pathId={id}
          queryId={newAdminId}
        />
      )}
    </ThemeProvider>
  );
};

export default CollegeFormDialog;
