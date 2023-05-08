import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom";

import AllSpots from "./components/AllSpots";
import SpotDetails from "./components/AllSpots/OneSpot";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path="/" component={AllSpots} />
        <Route path="/spots/:id">
          <SpotDetails />
        </Route>
      </Switch>}
    </>
  );
}

export default App;
