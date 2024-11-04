/* eslint-disable react/prop-types */
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'

function ConfirmationDialog({ modalTitle, open, close,confirmOperation, }) {

  return (
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          {modalTitle}
        </DialogTitle>

        <DialogActions>
          <Button onClick={close} variant="contained" style={{ backgroundColor: '#f59e0b' }}>No</Button>
          <Button onClick={confirmOperation} autoFocus variant="contained" style={{ backgroundColor: '#16a34a' }}>Yes</Button>
        </DialogActions>
      </Dialog>
  );
}

export default ConfirmationDialog;
