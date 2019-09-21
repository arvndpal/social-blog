const Post = require('../models/post')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.getPosts = async(req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    const posts = await Post.find()
        // countDocuments() gives you total count of posts
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .populate("comments", "text created")
                .populate("comments.postedBy", "_id name")
                .populate("postedBy", "_id name")
                .sort({ date: -1 })
                .limit(perPage)
                .select("_id title body likes");
        })
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => console.log(err));
};

exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        let post = new Post(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        console.log("post ==>", post)
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.postByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id title body created likes')
        .sort('created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }

            res.json(posts)
        })
}

exports.postById = (req, res, next, id) => {
    console.log('pos id', id)
    Post.find({ _id: id })
        .populate('postedBy', '_id name')
        .populate("comments.postedBy", "_id name  role")
        .select("_id title body created likes comments photo")
        .exec((err, post) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            req.post = post[0]
            console.log("rq.post", req.post)
            next()
        })
}

exports.isPoster = (req, res, next) => {
    // console.log('req.post==>', req.post)
    // console.log('req.auth==>', req.auth)
    // console.log(' req.post.postedBy._id==>', req.post.postedBy._id)
    // console.log('req.auth._id', req.auth._id)
    let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id
    let adminUser = req.post && req.auth && req.auth.role === "admin"
    let isPoster = sameUser || adminUser;
    if (!isPoster) {
        if (err) {
            return res.status(400).json({
                error: 'User is not Authenticated'
            })
        }
    }
    next()
}

exports.deletePost = (req, res) => {
    let post = req.post
    console.log('post ==>', post)
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({ message: 'Post deleted successfully' })
    })
}

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();
        console.log("post", post);
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};

exports.photo = (req, res, next) => {
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

exports.singlePost = (req, res) => {
    return res.json(req.post);
};

exports.like = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId, { $push: { likes: req.body.userId } }, { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(result);
    })
}

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId, { $pull: { likes: req.body.userId } }, { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(result);
    })
}

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    Post.findByIdAndUpdate(
            req.body.postId, { $push: { comments: comment } }, { new: true }
        )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(
            req.body.postId, { $pull: { comments: { _id: comment._id } } }, { new: true }
        )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};