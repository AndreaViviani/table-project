import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./../Home/Home";
import ViewData from "../ViewData/ViewData";
import style from "./App.module.css";

function App() {
  return (
    <div>
      <h1 className={style.titleProject}>
        My Table Project
      </h1>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/view-table" exact component={ViewData}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
