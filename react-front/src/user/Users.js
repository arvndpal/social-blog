import React, { Component } from 'react'
import { list } from './apiUser'

import apiUrl from '../config/env.json'
import defaultProfile from '../images/avatar.jpg'
import { Link } from 'react-router-dom'
class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }
  }

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        console.log(data)
        this.setState({ users: data })
      }
    })
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
                  to={`/user/${user._id}`}
                  className="btn btn-raised btn-sm btn-primary">
                  view profile
                  </Link>
              </div>
            </div>
          )
        })
      }
    </div>)
  }
  render() {
    const { users } = this.state
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        {
          this.renderUsers(users)
        }
      </div>
    )
  }
}

export default Users