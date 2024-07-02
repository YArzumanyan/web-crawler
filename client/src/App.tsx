import { Outlet } from "react-router-dom";
import { Navigation } from "./components/Navigation";

function App() {
  return (
    <div className="vh-100">
      <Navigation />
      <Outlet />
    </div> 
  )
};

export default App;
