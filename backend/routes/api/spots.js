const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { Spot, User, Image, Review, sequelize} = require("../../db/models");

const router = express.Router();
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const image = require('../../db/models/image');

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

//get all Spots----------------------------------------
router.get("/", async (req, res) => {
    const spots = await Spot.findAll()
    res.status(200).json(spots)
})

//get all Spots for current User ----------------------
router.get("/current", requireAuth, async (req, res) => {
    const { user } = req
    const currentUserSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })
    res.status(200).json({"Spots": currentUserSpots})
})
//get details of a Spot from an id---------------------
// needs: preview image
router.get("/:id", async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)

    if (!spot) {
        res.status(400).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    //avgRating
    let starRatingArr = []
    let spotJson = spot.toJSON()
    let spotRating = await Review.findOne({
        where: {
            spotId: spot.id
        },
        attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']]
    })
    let rating = spotRating.dataValues.avgRating.toFixed(2) //limit decimal to 2 places
    if (!rating) {
        spotJson.avgRating = "No Reviews yet"
    } else {
        spotJson.avgRating = rating
    }
    console.log("trying to get average rating num isolated", spotJson.avgRating)
    starRatingArr.push(spotJson)

    // SpotImages WIP
    // let spotImages = []
    // let images = await Image.findAll({
    //     where: {
    //         spotId: spot.id
    //     },
    //     attributes: [ 'id','url', 'preview']
    // })
    // let img = images.dataValues.previewImage
    // if (!img) {
    //     spotJson.previewImage = 'no preview picture found'
    // } else {
    //     spotJson.previewImage = img
    // }
    // spotImages.push(spotJson)

    res.status(200).json({
        spot: {
            starRatingArr,
        }
    })
})



// middleware checking if a spot exists
/*maybe let the current data be saved when used for edit*/

const spotCheck = (req, res, next) => {
    let errors = []

    if (!req.body.address) errors.push("Street address is required")
    if (!req.body.city) errors.push("City is required")
    if (!req.body.state) errors.push("State is required")
    if (!req.body.country) errors.push("Country is required")
    if (!req.body.lat) errors.push("Latitude is not valid")
    if (!req.body.lng) errors.push("Longitude is not valid")
    if (!req.body.name) errors.push("Name must be less than 50 characters")
    if (!req.body.description) errors.push("Description is required")
    if (!req.body.price) errors.push("Price per day is required")

    if(errors.length > 0) {
        const err = new Error('Invalid user Input')
        err.statusCode = 400
        err.errors = errors
        return next(err)
    }
    next()
}
//create a Spot        //Works

router.post("/", spotCheck, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    const newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

        if (validationResult === false) {
            res.status(400).json({
                message: "Validation Error",
                statusCode: 400,
                errors
            })
        } else {
            res.status(201).json({
                message: "SUCCESS!(no message needed delete later)",
                statusCode: 201,
                Spot: newSpot
            })

        }
})
router.get("/:id/images",  async (req, res) => {
    const images = await Image.findAll()
    res.status(200).json(images)
})

//create an Image for a Spot----------------DONE---------------------
router.post("/:id/images", requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.id);
    const { user } = req
    if (spot.ownerId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }
    if (spot === null) {
        res.status(200).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    const { url, preview } = req.body;
    console.log("another console log for spot---->", spot)
    const image = await spot.createImage({
        url, preview
    })


    res.status(200).json({spot: image})
})

//create a Review based on a Spot id---------------------------
router.post("/:id/reviews", requireAuth, async (req, res) => {
    
    res.status(200).json({
        /*return id, spotId, Spot:{all the stuffs},userId, start,end */
    })
})

//GET all current Reviews by Spot id---------------------------
router.get('/:id/reviews', async (req, res) => {

    res.status(200).json()
})

//GET all current Bookings by Spot id---------------------------
router.get('/:id/bookings', async (req, res) => {

    res.status(200).json()
})

//create a Booking based on a Spot id---------------------------
router.post("/:id/bookings",  async (req, res) => {

    res.status(200).json({
        /*return id, spotId, Spot:{all the stuffs},userId, start,end */
    })
})



//edit a Spot // WORKS---------------------------------------
router.put("/:id", spotCheck, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    let spot = await Spot.findByPk(req.params.id)
    spot.address = address,
    spot.city = city,
    spot.state = state,
    spot.country = country,
    spot.lat = lat,
    spot.lng = lng,
    spot.name = name,
    spot.description = description,
    spot.price = price

    if (!spot) {
    res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
    } else if (validationResult === false) {
        res.status(400).json({
            message: "This Spot successfully updated",
            statusCode: 400,
            errors
        })
    } else {
        await spot.save()
        res.status(200).json({
            message: "This Spot successfully updated",
            spot
        })
    }
})

// delete a Spot    // WORKS!-------------------------------
router.delete("/:id", requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
        })
    }
    await spot.destroy()
    res.status(200).json({
        message: "Successfully deleted"
    })
})


module.exports = router;
