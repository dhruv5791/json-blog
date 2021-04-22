import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import User from "./components/User";
import CircularProgress from "@material-ui/core/CircularProgress";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken:
        "bbded0af83d1790beb279eb662a4969d48305208d568dc8d23f6119564f848e8",
      users: [],
      loading: false,
      open: false,
      user: null,
      viewOnly: false,
      newUser: {
        name: null,
        email: null,
        gender: null,
        status: null,
      },
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  handleClose() {
    this.setState({ open: false, user: null });
  }

  viewUser(user) {
    this.setState({ user, open: true, viewOnly: true });
  }

  editUser(user) {
    this.setState({ user, open: true, viewOnly: false });
  }

  handleChange(event) {
    this.setState({ newUser: { gender: event.target.value } });
  }

  async getUsers() {
    if (!this.state.loading) {
      this.setState({ loading: true });
    }
    await fetch(
      `https://gorest.co.in/public-api/users?access-token=${this.state.accessToken}`
    )
      .then((response) => response.json())
      .then((json) => this.setState({ users: json.data, loading: false }));
  }

  async saveUser(data) {
    await this.postData(`https://gorest.co.in/public-api/users`, "POST", data);
  }

  async updateUser(data) {
    await this.postData(
      `https://gorest.co.in/public-api/users/${data.id}`,
      "PUT",
      data
    );
  }

  async postData(apiUrl, methodType, data) {
    var bearer = "Bearer " + this.state.accessToken;

    await fetch(apiUrl, {
      method: methodType,
      headers: {
        Authorization: bearer,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => this.getUsers())
      .catch((error) =>
        this.setState({
          isLoading: false,
          message: "Something bad happened " + error,
        })
      );
  }

  async deleteUser(e, userId) {
    e.preventDefault();
    this.setState({ loading: true });
    var url = `https://gorest.co.in/public-api/users/${userId}`;
    var bearer = "Bearer " + this.state.accessToken;
    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: bearer,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => this.getUsers())
      .catch((error) =>
        this.setState({
          isLoading: false,
          message: "Something bad happened " + error,
        })
      );
  }

  render() {
    const classes = makeStyles({
      table: {
        minWidth: 650,
      },
    });
    const { users, open, user, loading, viewOnly } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <Box mx="auto" bgcolor="background.paper" p={5}>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.id}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <ButtonGroup
                        variant="contained"
                        aria-label="contained button group"
                      >
                        <Button onClick={(e) => this.viewUser(user)}>
                          View
                        </Button>
                        <Button
                          color="primary"
                          onClick={(e) => this.editUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={(e) => this.deleteUser(e, user.id)}
                          color="secondary"
                        >
                          {loading ? <CircularProgress /> : "Delete"}
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box position="absolute" bottom={0} right={0} p={2}>
          <Fab
            color="primary"
            onClick={() =>
              this.setState({
                open: !this.state.open,
                user: null,
                viewOnly: false,
              })
            }
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        </Box>
        <User
          open={open}
          user={user}
          viewOnly={viewOnly}
          updateUser={(data) => this.updateUser(data)}
          saveUser={(data) => this.saveUser(data)}
          handleClose={() => this.handleClose()}
        />
      </React.Fragment>
    );
  }
}

export default App;
