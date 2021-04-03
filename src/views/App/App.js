import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./../Home/Home";
import ViewData from "../ViewData/ViewData";
import style from "./App.module.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/view-table" exact component={ViewData} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
