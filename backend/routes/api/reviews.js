const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User , Review, Spot, Image } = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//GET all Reviews of Current User-------------------
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    const currentUserReviews = await Review.findAll({
        where: {
            userId: user.id,
        },
        include: [
            {model: User,
            attributes: ['id','firstName','lastName']
            }
            , Spot /*needs a ReviewsImage column*/
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
        url, spotId: review.spotId, reviewId: +req.params.id
    })
    res.status(200).json(newReviewImage)
});
//Edit a Review-------------------------------------
//errors not working properly> its an issue with line 54 & 55
router.put('/:id', requireAuth, async (req, res) => {
    const { user } = req
    const { review, stars } = req.body;
    const reviews = await Review.findByPk(req.params.id)
    reviews.review = review,
    reviews.stars = stars
    console.log("This is a console log for reviews", reviews)
    if (!reviews) {
        res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    if (reviews.userId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }

    await reviews.save()
    res.status(200).json(reviews)
});
//Delete a Review-----------------------------------
router.delete('/:id', async (req, res) => {

    res.status().json()
});


module.exports = router;
