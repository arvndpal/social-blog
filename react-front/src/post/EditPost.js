import React, { Component } from 'react'
import { singlePost, update } from './apiPost'
import { isAuthenticated } from '../auth'
import { Redirect } from "react-router-dom";
import defaultPost from '../images/mountain.jpg'
import apiUrl from '../config/env.json'

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      postedById: "",
      title: "",
      body: "",
      redirectToProfle: false,
      error: "",
      fileSize: 0,
      loading: false
    }
  }

  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        console.log("singlepost data ==>", data);
        this.setState({
          // id is not post.postedBy._id
          id: data._id,
          title: data.title,
          body: data.body,
          error: "",
          postedById: data.postedBy._id
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId)

  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 100000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value =
      name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then(data => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            redirectToProfile: true
          });
        }
      });
    }
  };

  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Body</label>
        <textarea
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}
        />
      </div>

      <button
        onClick={this.clickSubmit}
        className="btn btn-raised btn-primary"
      >
        Update Post
            </button>
    </form>
  );

  render() {
    const { title, body, redirectToProfile, id, error, loading, postedById } = this.state
    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }
    const photoUrl = id ? `${apiUrl[process.env.NODE_ENV].api_url}/post/photo/${id}?${new Date().getTime()}` : defaultPost

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>
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
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
          src={photoUrl}
          onError={i => i.target.src = `${defaultPost}`}
          alt={title}
        />
        {isAuthenticated().user.role === "admin" ||
          (isAuthenticated().user._id === postedById &&
            this.editPostForm(title, body))}
      </div>
    )
  }
}

export default EditPost