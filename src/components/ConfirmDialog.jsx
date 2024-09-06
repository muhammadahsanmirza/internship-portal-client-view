import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from '@mui/material'


function ConfirmationDialog(openConfirmDialog, closeConfirmDialog) {
  

  return (
    <>
      <Button variant="outlined" onClick={openConfirmDialog}>
        Open alert dialog
      </Button>
      <Dialog
        open={openConfirmDialog}
        onClose={closeConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Disagree</Button>
          <Button onClick={closeConfirmDialog} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfirmationDialog;