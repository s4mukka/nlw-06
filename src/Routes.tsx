import { BrowserRouter, Route } from "react-router-dom";

import { Home, NewRoom } from "./pages";

export const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/rooms/new" component={NewRoom} />
    </BrowserRouter>
  );
};
