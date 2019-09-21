import React, { Component } from 'react';
import { singlePost, remove, like, unlike } from './apiPost'
import defaultPost from '../images/mountain.jpg'
import apiUrl from '../config/env.json'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import { Redirect } from 'react-router-dom'
import Comment from './Comment'
class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      redirectToHome: false,
      like: false,
      likes: 0,
      comments: [],
      redirectToSignin: false
    }
  }

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  }
  componentDidMount() {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log("Error", data.error)
      } else {
        console.log("data ==>", data)
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        })
      }
    })
  }

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure, you want to delete your post?"
    )
    if (answer) {
      this.deletePost()
    }
  }

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log("Error=>", data.error)
      } else {
        this.setState({
          redirectToHome: true
        })
      }
    })
  }


  updateComments = comments => {
    this.setState({
      comments
    })
  }
  likeToggle = () => {

    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId)
      .then(data => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.setState({
            like: !this.state.like,
            likes: data.likes.length
          })
        }
      })

  }

  renderPost = post => {
    const posterId = post.postedBy
      ? `/user/${post.postedBy._id}` :
      ""
    const posterName = post.postedBy
      ? post.postedBy.name :
      " Unknown"
    const photoUrl = post._id ? `${apiUrl[process.env.NODE_ENV].api_url}/post/photo/${post._id}?${new Date().getTime()}` : defaultPost

    const { like, likes } = this.state;

    return (
      <div className="card-body">
        <img
          className="img-thumbnail"
          style={{ height: "400px", width: "100%", objectFit: "cover" }}
          src={photoUrl}
          onError={i => i.target.src = `${defaultPost}`}
          alt={post.title}
        />
        {like ? (
          <h3 onClick={this.likeToggle}>
            <i
              className="fa fa-thumbs-up text-success bg-dark mt-2"
              title="You have liked this post."
              style={{ padding: '10px', borderRadius: '50%', cursor: "pointer" }}
            />{' '}
            {likes} Like
                    </h3>
        ) : (
            <h3 onClick={this.likeToggle}>
              <i
                className="fa fa-thumbs-up   bg-dark t-2"
                title="Like the post"
                style={{ padding: '10px', marginTop: "8px", color: "#fff", borderRadius: '50%', cursor: "pointer" }}
              />{' '}
              {likes} Like
                    </h3>
          )}

        <p className="card-text">{post.body}</p>
        <p className="font-italic mark">
          Posted By <Link to={`${posterId}`}>{posterName} {"   "}</Link>
          on {new Date(post.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link
            to={`/`}
            className="btn btn-raised btn-sm btn-primary mr-5">
            Go to posts
        </Link>

          {
            isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id &&
            <>
              <Link
                to={`/post/edit/${post._id}`}
                className="btn btn-raised btn-sm btn-warning mr-5">
                Update Post
              </Link>
              <button
                onClick={this.deleteConfirmed}
                className="btn btn-raised btn-danger">
                Delete Post
              </button>
            </>
          }

        </div>
      </div>
    )
  }
  render() {
    const { post, redirectToHome, comments, redirectToSignin } = this.state;
    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }
    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

        {
          !post ? (
            <div className="jumbotron text-center"><h2>loading...</h2></div>
          ) : <>
              {
                this.renderPost(post)
              }
              <Comment
                postId={post._id}
                comments={comments.reverse()}
                updateComments={this.updateComments}
              />

            </>
        }
      </div>
    )
  }
}

export default SinglePost;
