import React, { Component } from 'react'
import apiUrl from '../config/env.json'
import defaultProfile from '../images/avatar.jpg'
import { Redirect, Link } from 'react-router-dom'

class ProfileTabs extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { followers, following, posts } = this.props

    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">Followers</h3>
            <hr />
            {
              followers.map((person, i) => {
                const photoUrl = person._id ? `${apiUrl[process.env.NODE_ENV].api_url}/user/photo/${person._id}?${new Date().getTime()}` : defaultProfile

                return (
                  <div key={i}>
                    <div>
                      <Link to={`/user/${person._id}`}>
                        <img

                          style={{
                            borderRadius: "50%",
                            border: "1px solid black"
                          }}
                          src={photoUrl} alt="" className="float-left mr-2"
                          height="30px"
                          width="30px"
                          onError={i => i.target.src = `${defaultProfile}`}
                          alt={person.name}
                        />
                        <div>
                          <p className="lead">{person.name}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              })
            }
          </div>

          <div className="col-md-4">
            <h3 className="text-primary">Following</h3>
            <hr />
            {
              following.map((person, i) => {
                const photoUrl = person._id ? `${apiUrl[process.env.NODE_ENV].api_url}/user/photo/${person._id}?${new Date().getTime()}` : defaultProfile

                return (
                  <div key={i}>
                    <div>
                      <Link to={`/user/${person._id}`}>
                        <img
                          style={{
                            borderRadius: "50%",
                            border: "1px solid black"
                          }}
                          src={photoUrl} alt="" className="float-left mr-2"
                          height="30px"
                          width="30px"
                          onError={i => i.target.src = `${defaultProfile}`}
                          alt={person.name}
                        />
                        <div>
                          <p className="lead">{person.name}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              })
            }
          </div>

          <div className="col-md-4">
            <h3 className="text-primary">Posts</h3>
            <hr />
            {
              posts.map((post, i) => {
                return (
                  <div key={i}>
                    <div>
                      <Link to={`/post/${post._id}`}>{post.title}</Link>
                    </div>
                  </div>
                )

              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileTabs; 