import React, { useState, useEffect } from "react";
import { Link, useHistory} from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import "./App.css";

function App() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  //load auth when component mounts
  useEffect(() => {
    onLoad();
  }, []);
  
  //check the status of the user session. user only authenticates only set to true if Auth.currentSesion() goes through
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      // Auth.currentSession() throws the below message when the user isn't signed in (which we don't want to display)
      if (e !== 'No current user') {
        onError(e)
      }
    }
    setIsAuthenticating(false);
  }

  //change the authentication when the users presses the log out button
  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/login");
  }


  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Jupiter Recipes</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {  //change navbar items dynamically based on auth status
              isAuthenticated
              ? <NavItem onClick={handleLogout}>Logout</NavItem>
              : <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider
        value={{ isAuthenticated, userHasAuthenticated }}
      >
        <Routes />
      </AppContext.Provider>
    </div>
  );
}

export default App;