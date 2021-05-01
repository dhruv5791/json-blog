import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Users from "./components/Users";

export class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Box mx="auto" bgcolor="background.paper" p={5}>
          <Users />
        </Box>
      </React.Fragment>
    );
  }
}

export default App;
