import React, { Component } from 'react'
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser'
import { Redirect } from 'react-router-dom'
import apiUrl from '../config/env.json'
import defaultProfile from '../images/avatar.jpg'

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: "",
      email: "",
      name: "",
      about: "",
      password: "",
      redirectToProfle: false,
      error: "",
      filesize: 0,
      loading: false
    }
  }

  init = userId => {

    const token = isAuthenticated().token;

    read(userId, token).then(data => {
      if (data.error) {
        console.log("ERROR")
        this.setState({ redirectToProfle: true })
      }
      else {
        console.log(data);
        this.setState({
          id: data._id,
          email: data.email,
          name: data.name,
          about: data.about,
          error: ""
        })
      }
    })
  }

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId)

  }

  handleChange = (name) => (event) => {
    this.setState({ error: "" })
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    let filesize = name === "photo" ? event.target.files[0].size : 0;
    console.log("ame", name, value)
    this.userData.set(name, value)
    this.setState({ [name]: value, filesize })
  }

  clickSubmit = event => {
    event.preventDefault();
    if (this.isValid()) {

      const token = isAuthenticated().token;
      const userId = this.props.match.params.userId;
      this.setState({ loading: true })
      update(userId, token, this.userData)
        .then(data => {
          console.log("dtaa ==>", data)
          if (data.error) {
            this.setState({ error: data.error })
          } else {
            updateUser(data, () => {
              this.setState({
                redirectToProfle: true
              })
            })
          }

        })
    }
  }

  isValid = () => {
    const { name, email, password, filesize } = this.state
    if (filesize > 100000) {
      this.setState({ error: "File size should be less than 100KB" })
      return false
    }
    if (name.trim().length === 0) {
      this.setState({ error: "Name is Required." })
      return false
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid email is required." })
      return false
    }
    if (password.trim().length >= 1 && password.trim().length <= 5) {
      this.setState({ error: "Password must be at least 6 characters." })
      return false
    }

    return true
  }

  signupForm = (name, email, password, about) => {
    return (
      <form>

        <div className="form-group">
          <label className="text-muted">Profile Photo</label>
          <input
            onChange={this.handleChange("photo")}
            type="file"
            accept="image*"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={this.handleChange("name")}
            type="text"
            value={name}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            onChange={this.handleChange("email")}
            type="email"
            value={email}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="text-muted">About</label>
          <textarea
            style={{
              minHeight: "100px"
            }}
            onChange={this.handleChange("about")}
            type="text"
            value={about}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            value={password}
          />
        </div>
        <button className="btn btn-raised btn-primary" onClick={this.clickSubmit}>Update</button>
      </form>
    )
  }

  render() {

    const { id, name, email, password, redirectToProfle, error, loading, about } = this.state;

    if (redirectToProfle) {
      return (<Redirect to={`/user/${id}`} />)
    }
    const photoUrl = id ? `${apiUrl[process.env.NODE_ENV].api_url}/user/photo/${id}?${new Date().getTime()}` : defaultProfile
    return (
      <div className="container">

        <h2 className="mt-5 mb-5">Edit Profile </h2>
        <div className="alert alert-danger" style={{ display: error ? "block" : "none" }}>
          {error}
        </div>

        {
          loading ? (
            <div className="jumbotron text-center"><h2>loading...</h2></div>
          ) :
            ""
        }
        <img
          className="img-thumbnail"
          style={{ height: "200px", width: "auto" }}
          src={photoUrl}
          onError={i => i.target.src = `${defaultProfile}`}
          alt={name}
        />
        {isAuthenticated().user.role === "admin" ||
          (isAuthenticated().user._id === id &&
            this.signupForm(name, email, password, about))}

      </div>
    )
  }
}

export default EditProfile