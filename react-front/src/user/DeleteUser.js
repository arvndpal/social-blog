import React, { Component } from 'react'
import { isAuthenticated, signout } from '../auth';
import { remove } from './apiUser'
import { Redirect } from 'react-router-dom'

class DeleteUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  deleteAccount = () => {
    console.log("account delete")

    let token = isAuthenticated().token,
      userId = this.props.userId

    remove(userId, token).then(data => {
      if (data.error) {
        console.log("ERROR", data.error);
      } else {
        signout(() => {
          console.log("user is deleted successfully.");
        })
        this.setState({ redirect: true })
      }
    })
  }

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure, you want to delete your account?"
    )
    if (answer) {
      this.deleteAccount()
    }
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to="/" />)
    }
    return (
      <button
        className="btn btn-raised btn-danger"
        onClick={this.deleteConfirmed}
      >
        Delete Profile
      </button>
    )
  }
}
export default DeleteUser;