const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User , Reviews} = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];
//GET all Reviews of Current User
router.get('/current', async (req, res) => {
})

//Get all Reviews by a Spot's id

//Create a Review for a Spot based on the Spot's id

//Add an Image to a Review based on the Review's id

//Edit a Review
//Delete a Review
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });

        if (!user) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = { credential: 'The provided credentials were invalid.' };
            return next(err);
        }

        await setTokenCookie(res, user);

        return res.json({
            user: user
        });
    }
);



module.exports = router;
