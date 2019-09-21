import React, { Component } from 'react'
import { list } from './apiPost'

import apiUrl from '../config/env.json'
import defaultPost from '../images/mountain.jpg'
import { Link } from 'react-router-dom'
class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      page: 1
    }
  }


  loadPosts = page => {
    list(page).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  loadMore = number => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
  };

  loadLess = number => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }

  renderPosts = posts => {

    return (
      <div className="row">
        {
          posts.map((post, i) => {
            const photoUrl = post._id ? `${apiUrl[process.env.NODE_ENV].api_url}/post/photo/${post._id}?${new Date().getTime()}` : defaultPost
            const posterId = post.postedBy
              ? `/user/${post.postedBy._id}` :
              ""
            const posterName = post.postedBy
              ? post.postedBy.name :
              " Unknown"
            return (
              <div className="card col-md-4" key={i}>
                <div className="card-body">
                  <img
                    className="img-thumbnail"
                    style={{ height: "200px", width: "100%" }}
                    src={photoUrl}
                    onError={i => i.target.src = `${defaultPost}`}
                    alt={post.title}
                  />
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.body.substring(0, 100)}</p>
                  <p className="font-italic mark">
                    Posted By <Link to={`${posterId}`}>{posterName} {"   "}</Link>
                    on {new Date(post.created).toDateString()}
                  </p>
                  <Link
                    to={`/post/${post._id}`}
                    className="btn btn-raised btn-sm btn-primary">
                    Read more
                  </Link>
                </div>
              </div>
            )
          })
        }
      </div>)
  }
  render() {
    const { posts, page } = this.state
    console.log("post===>", posts)
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">
          {!posts.length ? "No more posts!" : "Recent Posts"}
        </h2>
        {
          this.renderPosts(posts)
        }

        {page > 1 ? (
          <button
            className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
                    </button>
        ) : (
            ""
          )}

        {posts.length ? (
          <button
            className="btn btn-raised btn-success mt-5 mb-5"
            onClick={() => this.loadMore(1)}
          >
            Next ({page + 1})
                    </button>
        ) : (
            ""
          )}
      </div>
    )
  }
}

export default Posts