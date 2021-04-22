import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

export class User extends Component {
  static propTypes = {
    open: PropTypes.bool,
    user: PropTypes.object,
    handleClose: PropTypes.func,
    viewOnly: PropTypes.bool,
    updateUser: PropTypes.func,
    saveUser: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      status: "",
      gender: "",
      editing: false,
    };
  }

  handleForm() {
    const { editing, name, email, status, gender } = this.state;
    const { updateUser, saveUser } = this.props;
    if (editing) {
      const { id } = this.props.user;
      updateUser({ id, name, email, status, gender });
    } else {
      saveUser({ name, email, status, gender });
    }
  }

  processClose() {
    this.setState({
      name: "",
      email: "",
      gender: "",
      status: "",
      editing: false,
    });
    this.props.handleClose();
  }

  componentDidUpdate() {
    const { user, viewOnly } = this.props;
    if (user && !this.state.name) {
      this.setState({
        name: user.name,
        email: user.email,
        status: user.status,
        gender: user.gender,
        editing: viewOnly ? false : true,
      });
    }
  }

  render() {
    const { open, handleClose, viewOnly } = this.props;
    const { name, email, gender, status, editing } = this.state;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        onClose={() => handleClose()}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={() => handleClose()}>
          User Information
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                disabled={viewOnly}
                id="name"
                value={name}
                name="name"
                label="Name"
                onChange={(e) => this.setState({ name: e.target.value })}
                fullWidth
                autoComplete="given-name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                disabled={viewOnly}
                type="email"
                value={email}
                id="email"
                name="email"
                onChange={(e) => this.setState({ email: e.target.value })}
                label="Email"
                fullWidth
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender1"
                  value={gender}
                  onChange={(e) => {
                    this.setState({ gender: e.target.value });
                  }}
                >
                  <FormControlLabel
                    value="Female"
                    control={<Radio disabled={viewOnly} />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Male"
                    control={<Radio disabled={viewOnly} />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Status</FormLabel>
                <RadioGroup
                  row
                  aria-label="status"
                  name="status"
                  value={status}
                  onChange={(e) => {
                    this.setState({ status: e.target.value });
                  }}
                >
                  <FormControlLabel
                    value="Inactive"
                    control={<Radio disabled={viewOnly} />}
                    label="Inactive"
                  />
                  <FormControlLabel
                    value="Active"
                    control={<Radio disabled={viewOnly} />}
                    label="Active"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {viewOnly ? null : (
            <Button
              autoFocus
              onClick={(e) => this.handleForm()}
              color="primary"
            >
              {editing ? "Update" : "Save"}
            </Button>
          )}
          <Button
            autoFocus
            onClick={(e) => this.processClose()}
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default User;
