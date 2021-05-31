import { useMemo } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import AuthenticationPage from "./components/authentication/AuthenticationPage";
import NotePage from "./components/note/NotePage";
import AuthContext from "./contexts/AuthContext";
import useAuthReducer from "./reducers/useAuthReducer";

function App() {
  const [authState, authDispatch] = useAuthReducer();
  
  const authProviderValue = useMemo(() => {
    return {
      authState, 
      authDispatch
    }
  }, [authState, authDispatch]);

  return (
    <AuthContext.Provider value={authProviderValue}>
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
    </AuthContext.Provider>
  );
}

export default App;
