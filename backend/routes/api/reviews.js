const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User , Review, Spot } = require('../../db/models');
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
//GET all Reviews of Current User-------------------
router.get('/current', requireAuth, async (req, res) => {
    res.status().json()
});

//Add an Image to a Review based on the Review's id-
router.post("/:id/images", async (req, res) => {

    res.status().json()
});
//Edit a Review-------------------------------------
router.put('/:id', async (req, res) => {

    res.status().json()
});
//Delete a Review-----------------------------------
router.delete('/:id', async (req, res) => {

    res.status().json()
});

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
