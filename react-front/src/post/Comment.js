import React, { Component } from 'react'
import { comment, uncomment } from './apiPost'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import defaultProfile from '../images/avatar.jpg'
import apiUrl from '../config/env.json'

class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ""
    }
  }


  handleChange = event => {
    this.setState({
      text: event.target.value,
      error: ""
    })
  }

  isValid() {
    const { text } = this.state;
    if (!text.trim().length > 0 || text.length > 150) {
      this.setState({
        error: "Comment should not be empty and less than 150 characters long."
      })
      return false;
    }
    return true;
  }
  addComment = e => {
    e.preventDefault();
    if (!isAuthenticated()) {
      this.setState({
        error: "Please sign in to leave comment."
      })
      return false;
    }
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text })
        .then(data => {
          if (data.error) {
            console.log("ERROR:", data.error)
          } else {
            this.setState({ text: "" })
            this.props.updateComments(data.comments);
          }
        })
    }

  }

  deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are you sure, you want to delete your post?"
    )
    if (answer) {
      this.deleteComment(comment)
    }
  }

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment)
      .then(data => {
        if (data.error) {
          console.log("ERROR:", data.error)
        } else {
          this.props.updateComments(data.comments);
        }
      })
  }

  render() {
    const { comments } = this.props;
    const { error } = this.state
    return (
      <div>
        <h2>Leave a comment</h2>

        <form onSubmit={this.addComment}>
          <div className="div form-group">
            <input
              type="text"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.text}
              placeholder="Leave a comment..."
            />
            <button className="btn btn-raised btn-success mt-2">
              Post
            </button>
          </div>
        </form>
        <div className="alert alert-danger" style={{ display: error ? "block" : "none" }}>
          {error}
        </div>
        <div className="col-md-12 col-md-offset-2">
          <h3 className="text-primary">{comments.length} Comments</h3>

          {
            comments.map((comment, i) => {
              const photoUrl = comment.postedBy._id ? `${apiUrl[process.env.NODE_ENV].api_url}/user/photo/${comment.postedBy._id}?${new Date().getTime()}` : defaultProfile

              return (
                <div key={i}>
                  <div>
                    <Link to={`/user/${comment.postedBy._id}`}>
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "1px solid black"
                        }}
                        src={photoUrl} alt="" className="float-left mr-2"
                        height="30px"
                        width="30px"
                        onError={i => i.target.src = `${defaultProfile}`}
                        alt={comment.postedBy.name}
                      />
                    </Link>
                    <div>
                      <p className="lead">{comment.text}</p>
                      <p className="font-italic mark">
                        Posted By <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name} {"   "}</Link>
                        on {new Date(comment.created).toDateString()}
                        <span>
                          {
                            isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id &&
                            <span

                              onClick={() => this.deleteConfirmed(comment)}
                              className="text-danger float-right mr-1  ">
                              <i title="Remove comment" style={{ cursor: "pointer" }} className="fa fa-times " aria-hidden="true"></i>
                            </span>
                          }
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
export default Comment