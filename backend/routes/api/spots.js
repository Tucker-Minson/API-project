const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');

const { Spot, User, Image, Review } = require("../../db/models");

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

//get all Spots
router.get("/", async (req, res) => {
    let spots = await Spot.findAll()
    res.status(200).json(spots)
})

//this needs to be worked into findByPk
//get details of a Spot from an id
router.get("/:id", async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            //get Reviews for each spot
            { model: Review },
            //get Images for each spot
            { model: Image },
        ]
    })

    let spotsList = [];
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    });

    spotsList.forEach(spot => {
        spot.Images.forEach(image => {
            // console.log(image.preview)
            if (image.preview === true) {
                // console.log(image)
                spot.preview = image.url
            }
        })
        if (!spot.preview) {
            spot.preview = 'no preview picture found'
        }

        delete spot.Images
    })

    res.status(200).json(spotsList)
})

//get all Spots for current User
// needs to be by user Id
router.get("/current", async (req, res) => {
    const currentUserSpots = await Spot.findByPk( req.params.id)
    res.status(200).json(currentUserSpots)
})



// middleware checking if a spot exists

const spotCheck = (req, res, next) => {
    let errors = []

    if (!req.body.address) error.push("Street address is required")
    if (!req.body.city) error.push("City is required")
    if (!req.body.state) error.push("State is required")
    if (!req.body.country) error.push("Country is required")
    if (!req.body.lat) error.push("Latitude is not valid")
    if (!req.body.lng) error.push("Longitude is not valid")
    if (!req.body.name) error.push("Name must be less than 50 characters")
    if (!req.body.description) error.push("Description is required")
    if (!req.body.price) error.push("Price per day is required")

    if(errors.length > 0) {
        const err = new Error('Invalid user Input')
        err.statusCode = 400
        err.errors = errors
        return next(err)
    }
    next()
}
//create an Image for a Spot
router.post("/", spotCheck, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    const newSpot = await Spot.create(
        {address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    console.log(spotCheck)
    res.status(200).json({
        message: "Spot successfully added to the database :)",
        game: newSpot
    })
})

//create an Image for a Spot
router.post("/:id/images", async (req, res) => {

    if (error) {

        res.status(400).json(error)
    }
    res.status(201).json()
})
//create a Review for a Spot
router.post('/:id/reviews', async (req, res) => {

    res.status(201).json()
})

//edit a Spot
router.put("/:id", async (req, res) => {

    if (error) {
        console.log("This is a Vaidation error")

        res.status(400).json(error)
    } else if (error) {
        console.log("Spot couldn't be found")
        res.status(404).json(error)
    }
    res.status(200).json()
})

// delete a Spot
router.delete("/:id")


module.exports = router;
