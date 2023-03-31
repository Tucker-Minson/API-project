const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User , Review, Spot, Image } = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//GET all Reviews of Current User-------------------
router.get('/current', requireAuth, async (req, res) => {
    const { user, spot } = req
    const currentUserReviews = await Review.findAll({
        where: {
            userId: user.id,
        },
        include: [
            User, Spot /*needs a ReviewsImage column*/
        ]
    })
    res.status(200).json({
        Reviews: currentUserReviews
        // NEEDS:
            //User: {id, firstname, lastname}
            // Spots: {all Spot details}
            // ReviewImages: {id, url}
    })

});

//Add an Image to a Review based on the Review's id-
//Need to add reviewId to images table so it can be tracked

router.post("/:id/images", requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.id)
    const spot = await Spot.findByPk(review.spotId)
    const { url, preview } = req.body
    const newReviewImage = await spot.createImage({
        url, spotId: review.spotId
    })
    res.status(200).json(newReviewImage)
});
//Edit a Review-------------------------------------
router.put('/:id', async (req, res) => {

    res.status().json()
});
//Delete a Review-----------------------------------
router.delete('/:id', async (req, res) => {

    res.status().json()
});


module.exports = router;
