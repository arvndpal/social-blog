import React, { Component } from 'react'
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom'
import { read } from './apiUser'
import apiUrl from '../config/env.json'
import defaultProfile from '../images/avatar.jpg'
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FolloProfileButton'
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost'
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        following: [],
        followers: []
      },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: []
    }
  }
  // check follow
  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => follower._id === jwt.user._id)
    return match
  }

  clickFollowButtn = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    callApi(userId, token, this.state.user._id)
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          this.setState({
            user: data,
            following: !this.state.following
          })
        }
      })

  }

  loadPosts = userId => {

    let token = isAuthenticated().token;
    listByUser(userId, token)
      .then(data => {
        if (data.error) {
          console.log("Error", data.error)
        } else {
          this.setState({
            posts: data
          })
        }
      })
  }
  init = userId => {
    console.log("userId=>", userId)
    let token = isAuthenticated().token;

    read(userId, token).then(data => {
      if (data.error) {
        console.log("ERROR")
        this.setState({ redirectToSignin: true })
      } else {
        console.log(data);
        let following = this.checkFollow(data)
        this.setState({
          user: data,
          following
        })
        this.loadPosts(data._id)
      }
    })
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId)

  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId)
  }

  render() {
    const { user, redirectToSignin, posts } = this.state;
    console.log("postsposts=>", posts)

    if (redirectToSignin) {
      return (<Redirect to="/signin" />)
    }

    const photoUrl = user._id ? `${apiUrl[process.env.NODE_ENV].api_url}/user/photo/${user._id}?${new Date().getTime()}` : defaultProfile

    return (
      <div className="container">

        <h2 className="mt-5 mb-5">Profile </h2>
        <div className="row">
          <div className="col-md-4">

            <img
              className="img-thumbnail"
              style={{ height: "200px", width: "auto" }}
              src={photoUrl}
              onError={i => i.target.src = `${defaultProfile}`}
              alt={user.name}
            />
          </div>
          <div className="col-md-8">

            <div className="lead mt-2">

              <p>Hello {user.name}</p>
              <p> {user.email}</p>
              <p>
                <span>Joind on</span> <i>{`${new Date(user.created).toDateString()}`}</i>
              </p>
            </div>
            {
              isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                <div className="d-inline-block">
                  <Link
                    className="btn btn-raised btn-info mr-5"
                    to={`/create/post`}
                  >
                    Create Post
                  </Link>
                  <Link
                    className="btn btn-raised btn-success mr-5"
                    to={`/user/edit/${user._id}`}
                  >
                    Edit Profile
                  </Link>

                  <DeleteUser userId={user._id} />
                </div>
              ) : (

                  <FollowProfileButton
                    following={this.state.following}
                    onButtonClick={this.clickFollowButtn}
                  />
                )
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-5  ">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>


        </div>
      </div>
    )
  }
}

export default Profile;