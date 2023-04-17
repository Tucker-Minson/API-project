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
    if (!review) {
        res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
    })
    }
    const spot = await Spot.findByPk(review.spotId)
    const { url, preview } = req.body

    const newReviewImage = await spot.createImage({
        url, spotId: review.spotId, reviewId: +req.params.id
    })
    if (Number(newReviewImage) >= 10) {
        res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        })
    }
    res.status(200).json(newReviewImage)
});
//Edit a Review-------------------------------------
//errors not working properly> its an issue with line 54 & 55
router.put('/:id', requireAuth, async (req, res, next) => {
    const reviews = await Review.findByPk(req.params.id)
    const { user } = req
    const { id, review, stars } = req.body;

    if (!reviews.id) {
        res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    let errors = [];
    reviews.review = review,
    reviews.stars = stars

    if (reviews.userId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }
    if(!req.body.review) errors.push("Review text is required")
    if(req.body.stars < 1 || req.body.stars > 5) errors.push("Stars must be an integer from 1 to 5")
    if (errors.length > 0) {
        const err = new Error ("Validation error")
        err.statusCode = 400
        err.errors = errors
        return next(err)
    }
    next()

    await reviews.save()
    res.status(200).json(reviews)
});
//Delete a Review-----------------------------------
router.delete('/:id', requireAuth, async (req, res) => {
    let review = await Review.findByPk(req.params.id)
    if (!review) {
        res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    const { user } = req
    if (review.userId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }
    await review.destroy()
    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
});


module.exports = router;
