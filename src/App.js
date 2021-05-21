import { useMemo, useState } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import AuthenticationPage from "./components/authentication/AuthenticationPage";
import NotePage from "./components/note/NotePage";
import AuthContext from "./contexts/AuthContext";
import UserContext from "./contexts/UserContext";

function App() {
  const [user, setUser] = useState({
    id: null,
    name: "",
    login: "",
    password: "",
  });
  
  const [authenticated, setAuthenticated] = useState(false);

  const userProviderValue = useMemo(() => {
    return {
      user, 
      setUser
    }
  }, [user, setUser]);

  const authenticatedProviderValue = useMemo(() => {
    return {
      authenticated, 
      setAuthenticated
    }
  }, [authenticated, setAuthenticated]);

  return (
    <AuthContext.Provider value={authenticatedProviderValue}>
      <UserContext.Provider value={userProviderValue}>
        <Router>
          <Switch>
            <Route 
              exact
              path="/" 
              component={AuthenticationPage}
            />
            <Route 
              exact
              path="/notes" 
              component={NotePage}
            />
          </Switch>
        </Router>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
