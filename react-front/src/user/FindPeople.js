import React, { Component } from 'react'
import { findPeople, follow } from './apiUser'

import apiUrl from '../config/env.json'
import defaultProfile from '../images/avatar.jpg'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
class FindPeople extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      error: "",
      open: false,
      followingMessage: ""
    }
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token).then(data => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ users: data })
      }
    })
  }
  clickFollow = (person, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    follow(userId, token, person._id)
      .then(data => {
        console.log("daa==>", data)
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          let toFollow = this.state.users;
          toFollow.splice(i, 1)
          this.setState({ users: toFollow, open: true, followingMessage: `Following ${person.name}` })
        }
      });
  }

  renderUsers = users => {

    return (<div className="row">
      {
        users.map((user, i) => {
          const photoUrl = user._id ? `${apiUrl[process.env.NODE_ENV].api_url}/user/photo/${user._id}?${new Date().getTime()}` : defaultProfile

          return (
            <div className="card col-md-3" key={i}>
              <img
                className="img-thumbnail"
                style={{ height: "200px", width: "auto" }}
                src={photoUrl}
                onError={i => i.target.src = `${defaultProfile}`}
                alt={user.name}
              />
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.email}</p>
                <Link
                  to={`user/${user._id}`}
                  className="btn btn-raised btn-sm btn-primary">
                  view profile
                  </Link>
                <button
                  onClick={() => this.clickFollow(user, i)}
                  className="btn btn-raised btn-sm btn-info float-right">
                  Follow
                  </button>
              </div>
            </div>
          )
        })
      }
    </div>)
  }
  render() {
    const { users, followingMessage, open } = this.state
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Find People</h2>
        {
          open &&
          <div className="alert alert-success">
            <p>{followingMessage}</p>
          </div>
        }
        {
          this.renderUsers(users)
        }
      </div>
    )
  }
}

export default FindPeople