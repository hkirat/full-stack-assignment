// import Image from 'next/image'
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div>
      <h1>It is a Sign In Page</h1>
      <input type="email" placeholder="email" />
      <input type="password" placeholder="password" />
      <Link to="/problemset/all">
        <button>Sign In</button>
      </Link>
    </div>
  );
};

const LogIn = () => {
  return (
    <>
      <h1>It is a Log In Page</h1>
      <input type="email" placeholder="email" />
      <input type="password" placeholder="password" />
      <Link to="/problemset/all">
        <button>Log In</button>
      </Link>
    </>
  );
};

const AllProblem = () => {
  return <h1>Hello Folks</h1>;
};

export default function Home() {
  return (
    <Router>
      <div>
        <h1>Hello! If you are new, then</h1>
        <Link to="/Signin">
          <button>Sign In</button>
        </Link>
        <Link to="/Login">
          <button>Log In</button>
        </Link>
      </div>
      <Switch>
        <Route path="/Signin" component={SignIn} />
        <Route path="/Login" component={LogIn} />
        <Route path="/problemset/all" component={AllProblem} />
      </Switch>
    </Router>
  )
}
