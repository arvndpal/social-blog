const express = require('express')
const {
    allUsers,
    getUser,
    userById,
    updateUser,
    deleteUser,
    userPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople,
    hasAuthorization
} = require('../controllers/user')

const { requireSignin } = require('../controllers/auth')

const router = express.Router();

router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);
router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, hasAuthorization, updateUser);
router.delete('/user/:userId', requireSignin, hasAuthorization, deleteUser);

//user photo
router.get('/user/photo/:userId', userPhoto)

// who tto follow
router.get('/user/findpeople/:userId', requireSignin, findPeople)
    // any routes conatining userid or app first will execute userById method
router.param("userId", userById);

module.exports = router