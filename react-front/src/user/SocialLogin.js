import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login';
import { socialLogin, authenticate } from "../auth";
import { Redirect } from 'react-router-dom'

class SocialLogin extends Component {

  constructor() {
    super();
    this.state = {
      redirectToReferrer: false,
      isFbLogin: false
    };
  }

  responseGoogle = response => {
    console.log(response);
    const { googleId, name, email, imageUrl } = response.profileObj;
    const user = {
      password: googleId,
      name: name,
      email: email,
      imageUrl: imageUrl
    };
    // console.log("user obj to social login: ", user);
    socialLogin(user).then(data => {
      console.log("signin data: ", data);
      if (data.error) {
        console.log("Error Login. Please try again..");
      } else {
        console.log("signin success - setting jwt: ", data);
        authenticate(data, () => {
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  responseFacebook = (response) => {
    console.log("response===>", response);
    const { userID, name, email, picture } = response;
    if (response && !response.status) {
      const user = {
        password: userID,
        name: name,
        email: email ? email : `${userID}.fb.com`,
        imageUrl: picture.data.url
      };
      socialLogin(user).then(data => {
        console.log("signin data: ", data);
        if (data.error) {
          console.log("Error Login. Please try again..");
        } else {
          console.log("signin success - setting jwt: ", data);
          authenticate(data, () => {
            this.setState({ redirectToReferrer: true });
          });
        }
      });
    }

  }

  componentClicked = (value) => {
    console.log("clicked value=>", value)
  }

  render() {
    const { redirectToReferrer, isFbLogin } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <GoogleLogin
          clientId="326099775823-tad4jh2u9dpmm7h9pii53ns4bbn3oa51.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />
        <span style={{ marginLeft: "10px" }} className="fb-social-login-btn">
          <FacebookLogin
            style={{
              padding: "9px",
              marginLeft: "10px",
              borderRadius: "3px"
            }}
            appId="396552597695572"
            autoLoad={false}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook} />
        </span>
      </div>
    );
  }
}

export default SocialLogin;