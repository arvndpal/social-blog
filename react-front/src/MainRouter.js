import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import FindPeople from './user/FindPeople';
import Menu from './core/Menu';
import Users from './user/Users';
import NewPost from './post/NewPost';
import EditPost from './post/EditPost';
import SinglePost from './post/SinglePost';
import PrivateRoute from './auth/PrivateRoute';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

const MainRouter = () => (
  <div>
    <Menu />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route
        exact
        path="/reset-password/:resetPasswordToken"
        component={ResetPassword}
      />
      <Route exact path="/post/:postId" component={SinglePost} />

      <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
      <Route exact path="/users" component={Users} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />
      <PrivateRoute
        exact
        path="/user/edit/:userId"
        component={EditProfile}
      />
      <PrivateRoute
        exact
        path="/findpeople"
        component={FindPeople}
      />
      <PrivateRoute exact path="/user/:userId" component={Profile} />
      <PrivateRoute exact path="/create/post" component={NewPost} />
    </Switch>
  </div>
)
export default MainRouter;