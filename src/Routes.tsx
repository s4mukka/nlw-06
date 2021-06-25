import { BrowserRouter, Route, Switch } from "react-router-dom";

import { AdminRoom, Home, NewRoom, Room } from "./pages";

export const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" exact component={NewRoom} />
        <Route path="/rooms/:id" component={Room} />

        <Route path="/admin/rooms/:id" component={AdminRoom} />
      </Switch>
    </BrowserRouter>
  );
};
