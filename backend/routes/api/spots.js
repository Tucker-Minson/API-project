const express = require('express')
const { requireAuth } = require('../../utils/auth');

const { Spot, User, Image, Review, Booking} = require("../../db/models");

const sequelize = require('sequelize')
const Op = sequelize.Op
const router = express.Router();




//Middleware

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
//make this into a middle where so it will apply the avg stars in each endpoint
//should work for:
// get all spots,
// get all spots by current user
// get by spot id
// const getAvg = (req, res, next) => {}

//get all Spots----------------------------------------
router.get("/", async (req, res) => {
    let errorResult = { errors: [], }
    let {page, size, lat, lng, price} = req.query

    page = parseInt(page);
    size = parseInt(size);

    let query = {
        where: {},
        include: []
    }

    if (Number.isNaN(page) || page === '') page = 1;
    if (Number.isNaN(size) || size === '') size = 20;
    if (page > 10) page = 10;
    if (size > 20) size = 20;

    //error handling
    if (page < 0) errorResult.errors.push("Page must be greater than or equal to 0")
    if (req.query.size < 0 ) errorResult.errors.push("Size must be greater than or equal to 0")
    if (req.query.lat) {
        if (req.query.lat < -90) errorResult.errors.push("Minimum latitude is invalid")
        if (req.query.lat > 90) errorResult.errors.push("Maximum latitude is invalid")
        query.where.lat = {
            [Op.substring]: lat
        }
    }
    if (req.query.lng) {
        if (req.query.lng < -180) errorResult.errors.push("Minimum longitude is invalid")
        if (req.query.lng > 180) errorResult.errors.push("Maximum longitude is invalid")
        query.where.lat = {
            [Op.substring]: lng
        }
    }
    if (req.query.price < 0) errorResult.errors.push("Price must be greater than or equal to 0")

    if (errorResult.errors.length > 0) {
        res.status(400).json({
            message: "Validation Error",
            statusCode: 400,
            errors: errorResult.errors
        })
    }

    // queries

        const spots = await Spot.findAll({
            ...query,
            limit: size,
            offset: (page - 1) * size

        })
        return res.status(200).json({
            spots,
            page,
            size
        })


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
    let rating = spotRating.dataValues.avgRating
    if (!rating) {
        spotJson.avgRating = "No Reviews yet"
    } else {
        spotJson.avgRating = rating.toFixed(2)
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

//Get Reviews by Spot Id---------------------------
router.get("/:id/reviews", async (req, res) => {

    let spot = await Spot.findByPk(req.params.id)
    const reviews = await Review.findAll({
        where: {spotId: spot.id},
        include: {model: User, attributes: ['id','firstName','lastName']}
    })
    // let reviewImages = await reviews.reduce(async (accum, review) => {
    //     const images = await Image.findAll({
    //         attributes: ['id', 'url'],
    //         where: {reviewId: review.id},
    //     })
    //     return [...accum, ...images]
    // }, [])

    if (!spot) {
        res.status(400).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    res.status(200).json({
        Reviews: reviews,
        // ReviewImages: reviewImages,
    })
})



//create a Spot        //Works

router.post("/", spotCheck, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    const {user} = req

    const newSpot = await Spot.create({
        ownerId: user.id,
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

            res.status(201).json({
                message: "SUCCESS!(no message needed delete later)",
                statusCode: 201,
                Spot: newSpot
            })


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
    const spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.status(200).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    const { user } = req
    if (spot.ownerId === user.id) {
        res.json({
            message: "Cannot review own your own spot",
            statusCode: 400,
        })
    }

    const { spotId, review, stars} = req.body
    let errors = [];
    if (!review) errors.push("Review text is required")
    if (!stars) errors.push("Stars must be an integer from 1 to 5")
    if (errors.length) {
        res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors
        })
    }
    const reviews = await spot.createReview({
        userId: user.id,
        spotId, review, stars
    })


    res.status(200).json({
        reviews
        /*return id, spotId, Spot:{all the stuffs},userId, start,end */
    })
})



//GET all current Bookings by Spot id---------------------------
router.get('/:id/bookings', requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    const { user } = req
    if (!spot) {
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    if (spot.ownerId !== user.id) {
        const bookings = await Booking.findAll({
            where: {spotId: spot.id},
            attributes: ['spotId', 'startDate', 'endDate']
        })
        res.status(200).json(bookings)
    }

    if (spot.ownerId === user.id) {
        const bookings = await Booking.findAll({
            where: {spotId: spot.id},
            include: {model: User, attributes: ['id','firstName','lastName']},
        })

        res.status(200).json(bookings)
    }
})

//create a Booking based on a Spot id---------------------------
router.post("/:id/bookings", requireAuth,  async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    const {userId, spotId, startDate, endDate} = req.body


    if (!spot) {
        res.status(200).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    const { user } = req
    if (spot.ownerId === user.id) {
        res.json({
            message: "Cannot book own your own spot",
            statusCode: 400,
        })
    }


    let errors = [];
    if (new Date(startDate) >= new Date(endDate) ) errors.push("endDate cannot be on or before startDate")
    //need err for checking overlapping dates of other users.

    if (errors.length) {
        res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors
        })
    }
    const booking = await spot.createBooking({
        userId: user.id,
        spotId, startDate, endDate
    })
    res.status(200).json({
        message: "The Booking was successful",
        booking
    })
})



//edit a Spot // WORKS---------------------------------------
router.put("/:id", spotCheck, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    let spot = await Spot.findByPk(req.params.id)
    const { user } = req
    if (spot.ownerId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }
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
    } else {
        await spot.save()
        res.status(200).json({
            message: "This Spot successfully updated",
            spot
        })
    }
})

// delete a Spot    
router.delete("/:id", requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    const { user } = req
    if (spot.ownerId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }
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
