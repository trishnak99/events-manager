import React, {useState} from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/auth";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";

function App(props) {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <div>
          {/* <ul>
            <li>
              <Link to="/">Home Page</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin">Admin Page</Link>
            </li>
          </ul> */}
          {/* <Route exact path="/" component={Home} /> */}
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute exact path="/" component={Dashboard} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <Counter />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <span>
//           <span>Learn </span>
//           <a
//             className="App-link"
//             href="https://reactjs.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             React
//           </a>
//           <span>, </span>
//           <a
//             className="App-link"
//             href="https://redux.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Redux
//           </a>
//           <span>, </span>
//           <a
//             className="App-link"
//             href="https://redux-toolkit.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Redux Toolkit
//           </a>
//           ,<span> and </span>
//           <a
//             className="App-link"
//             href="https://react-redux.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             React Redux
//           </a>
//         </span>
//       </header>
//     </div>
//   );
// }

// export default App;
