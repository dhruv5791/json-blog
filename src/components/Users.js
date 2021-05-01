import React, { Component } from "react";
import User from "../components/User";
import { XGrid } from "@material-ui/x-grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dropdown from "react-dropdown";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
const options = ["Id", "Name", "Email"];
const defaultOption = options[0];

export class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken:
        "bbded0af83d1790beb279eb662a4969d48305208d568dc8d23f6119564f848e8",
      data: [],
      users: [],
      pagination: {},
      page: 0,
      loading: false,
      rowSelected: false,
      open: false,
      user: null,
      searchTerm: "",
      searchParameter: "name",
      editing: false,
      viewOnly: false,
      columns: [
        {
          field: "",
          headerName: "Actions",
          sortable: false,
          width: 200,
          disableClickEventBubbling: true,
          renderCell: (params) => {
            const onEdit = () => {
              const api = params.api;
              const fields = api
                .getAllColumns()
                .map((c) => c.field)
                .filter((c) => c !== "__check__" && !!c);
              const thisRow = {};

              fields.forEach((f) => {
                thisRow[f] = params.getValue(f);
              });

              this.setState({ user: thisRow, open: true, editing: true });

              return;
            };

            const onDelete = async () => {
              const api = params.api;
              const fields = api
                .getAllColumns()
                .map((c) => c.field)
                .filter((c) => c !== "__check__" && !!c);
              const thisRow = {};

              fields.forEach((f) => {
                thisRow[f] = params.getValue(f);
              });

              return await this.deleteUser(thisRow.id);
            };

            return (
              <React.Fragment>
                <ButtonGroup
                  variant="contained"
                  aria-label="contained button group"
                >
                  <Button color="primary" onClick={onEdit}>
                    Edit
                  </Button>
                  <Button onClick={onDelete} color="secondary">
                    Delete
                  </Button>
                </ButtonGroup>
              </React.Fragment>
            );
          },
        },
        { field: "id", headerName: "ID", flex: 1 },
        { field: "name", headerName: "Name", flex: 1, editable: true },
        { field: "email", headerName: "Email", flex: 1, editable: true },
        { field: "gender", headerName: "Gender", flex: 1, editable: true },
        { field: "status", headerName: "Status", flex: 1, editable: true },
        { field: "created_at", headerName: "Created At", flex: 1 },
        { field: "updated_at", headerName: "Updated At", flex: 1 },
      ],
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  handleClose() {
    this.setState({ open: false, user: null });
  }

  handleChange(event) {
    this.setState({ newUser: { gender: event.target.value } });
  }

  async handleSearch(searchParameter, searchTerm) {
    await this.getUsers(1, searchTerm);
  }

  async getUsers(page = 1, searchTerm = "") {
    const { searchParameter } = this.state;
    if (!this.state.loading) {
      this.setState({ loading: true });
    }
    let url = `https://gorest.co.in/public-api/users?page=${page}&access-token=${this.state.accessToken}`;

    if (searchTerm.length > 0) {
      url = `${url}&${searchParameter}=${searchTerm}`;
    }
    await fetch(url)
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          users: json.data,
          pagination: json.meta.pagination,
          loading: false,
        })
      )
      .catch((err) => this.setState({ loading: false }));
  }

  async saveUser(data) {
    await this.postData(`https://gorest.co.in/public-api/users`, "POST", data);
  }

  async updateUser(data) {
    console.log(data);
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
      .then((response) => {
        this.setState({ open: false, user: null });
        this.getUsers();
      })
      .catch((error) =>
        this.setState({
          isLoading: false,
          message: "Something bad happened " + error,
        })
      );
  }

  handleRowClick(userData) {
    console.log(userData);
    this.setState({ user: userData.row, rowSelected: true });
  }

  async deleteUser(userId) {
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

  async handlePageChange(params) {
    this.setState({ page: params.page + 1 });
    await this.getUsers(params.page + 1);
  }

  render() {
    const {
      users,
      pagination,
      open,
      user,
      loading,
      columns,
      editing,
      searchTerm,
      searchParameter,
    } = this.state;

    return (
      <React.Fragment>
        <div style={{ height: "500px", width: "100%" }}>
          <Grid container mb={4} spacing={3}>
            <Grid item xs={3}>
              <Fab
                color="primary"
                onClick={() =>
                  this.setState({
                    open: !this.state.open,
                    user: null,
                    viewOnly: false,
                    editing: false,
                  })
                }
                aria-label="add"
              >
                <AddIcon />
              </Fab>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchParameter}
                onChange={(e) => {
                  this.setState({ searchParameter: e.target.value });
                  this.handleSearch(e.target.value, searchTerm);
                }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="id">ID</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="outlined-basic"
                value={searchTerm}
                onChange={(e) => {
                  this.setState({ searchTerm: e.target.value });
                  this.handleSearch(searchParameter, e.target.value);
                }}
                fullWidth={true}
                placeholder="Search here..."
                label="Search"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <XGrid
            pagination
            pageSize={pagination.limit}
            onRowClick={(param) => this.handleRowClick(param)}
            rowCount={pagination.total}
            paginationMode="server"
            onPageChange={(param) => this.handlePageChange(param)}
            loading={loading}
            rows={users}
            columns={columns}
          />
        </div>
        <User
          open={open}
          user={user}
          editing={editing}
          updateUser={(data) => this.updateUser(data)}
          saveUser={(data) => this.saveUser(data)}
          handleClose={() => this.handleClose()}
        />
      </React.Fragment>
    );
  }
}

export default Users;
