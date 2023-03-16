const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');

const { Spot, User, Image, Review } = require("../../db/models");

const router = express.Router();
const { check, validationResult } = require('express-validator');
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

//get all Spots----------------------------------------
router.get("/", async (req, res) => {
    let spots = await Spot.findAll()
    console.log("Say Hello")
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
    const currentUserSpots = await Spot.findByPk(req.params.id)
    console.log("This is req.params.id -->", req.params.id)
    console.log("Say Hello")
    res.status(200).json(currentUserSpots)
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
/*
-NEEDS:
    --Authorization
    --Error
    --
 */
router.post("/", spotCheck, async (req, res) => {
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
                message: "Spot successfully added to the database :)",
                game: newSpot
            })

        }
})

//create an Image for a Spot-------------------------------------
router.post("/:id/images",  async (req, res) => {
    const image = await Spot.findByPk(req.params.id);
    const { url, preview } = req.body;

    const newSpotImage = await image.createImage({
        url,
        preview
    })

    res.status(200).json(newSpotImage)
})

//edit a Spot // WORKS--------------------------------------
router.put("/:id", spotCheck, async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
