exports.createPostValidator = (req, res, next) => {
    req.check('title', 'Write a title').notEmpty()
    req.check('title', 'Title must be between 4 nd 50 chracters').isLength({
        min: 4,
        max: 150
    })

    req.check('body', 'Write a body').notEmpty()
    req.check('body', 'Body must be between 4 nd 2000 chracters').isLength({
        min: 4,
        max: 2000
    })

    // check for errors
    let errors = req.validationErrors()

    if (errors) {
        errors = errors.map(error => error.msg)
        res.status(400).json({ errors })
    }
    // proceed to next middleware
    next();
}

exports.userSignupValidator = (req, res, next) => {

    req.check('name', 'Name is required.').notEmpty();
    // email is not null, valid and noralized
    req.check("email", "Email must between 3 to 32 characters")
        .matches(/.+\@..+/)
        .withMessage("Email must contain @ symbol")
        .isLength({
            min: 4,
            max: 200
        })

    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({
            min: 6
        })
        .withMessage("Password must contain at least one charcters")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")

    // check for errors
    let errors = req.validationErrors()

    if (errors) {
        const error = errors.map(error => error.msg)[0]
        res.status(400).json({ error })
    }
    // proceed to next middleware
    next();
}

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    console.log("in validator")
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen 
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next()
}