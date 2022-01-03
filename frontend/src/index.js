import React from "react";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import "./index.css";

import { render } from "react-dom";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./history";
import rootReducer from "./reducers";
import Root from "./comonents/Root";
import { fetchAuthenticated } from "./action/account";
import AccountDragons from "./comonents/AccountDragons";
import PublicDragons from "./comonents/PublicDragons";


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Redux DevTools
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const AuthRoute = (props) => {
  if (!store.getState().account.loggedIn) {
    return <Redirect to={{ pathname: "/" }} />;
  }

  const { component, path } = props;
  return <Route path={path} component={component} />;
};

store.dispatch(fetchAuthenticated()).then(() => {
  render(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Root} />
          <AuthRoute path="/account-dragons" component={AccountDragons} />
          <AuthRoute path="/public-dragons" component={PublicDragons} />
        </Switch>
      </Router>
    </Provider>,
    document.getElementById("root")
  );
});
