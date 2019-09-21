const express = require('express')
const {
    getPosts,
    createPost,
    postByUser,
    postById,
    isPoster,
    deletePost,
    updatePost,
    photo,
    singlePost,
    like,
    unlike,
    comment,
    uncomment
} = require('../controllers/post');

const { requireSignin } = require('../controllers/auth')
const { createPostValidator } = require('../validator')

const { userById } = require('../controllers/user')
const router = express.Router()

router.get('/posts', getPosts)

//like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

// comments
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.post('/post/new/:userId', requireSignin, createPost, createPostValidator)
router.get('/post/:postId', singlePost)
router.get('/post/by/:userId', requireSignin, postByUser)
router.delete('/post/:postId', requireSignin, isPoster, deletePost)
router.put('/post/:postId', requireSignin, isPoster, updatePost)

//user photo
router.get('/post/photo/:postId', photo)

// any routes conatining userid , app first will execute userById method
router.param("userId", userById);

// any routes conatining postid, app first will execute postById method
router.param("postId", postById);

module.exports = router