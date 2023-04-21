
const express = require('express')
const { requireAuth } = require('../../utils/auth');

const { Spot, User, Image, Review, Booking} = require("../../db/models");

const sequelize = require('sequelize')
const Op = sequelize.Op
const router = express.Router();

//-------------for date Range ---------------
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
//---------------------------------------------

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
            offset: (page - 1) * size,
            include: {model: Review}
        })

        //getting avgRating for each

        let finalSpots = spots.map(spot => {
            let reviews = spot.toJSON().Reviews
            let starRatings = []
            let reviewArr = []

            reviews.forEach(review => {
                let rating = review.stars
                starRatings.push(rating)
                reviewArr.push(reviews)
            });
            let sumRatings = starRatings.reduce((prevNum, currNum) => prevNum + currNum, 0)
            let avgRating = parseFloat((sumRatings/starRatings.length).toFixed(2))
            spot.avgRating = avgRating
            let j = spot.toJSON()
            delete j.Reviews
            return j
        });

        return res.status(200).json({
            spots: finalSpots,
            page,
            size
        })


})

//get all Spots for current User ----------------------
router.get("/current", requireAuth, async (req, res) => {
    const { user } = req
    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        }, include :{model: Review}
    })
    let finalSpots = spots.map(spot => {
        let reviews = spot.toJSON().Reviews
        let starRatings = []
        let reviewArr = []

        reviews.forEach(review => {
            let rating = review.stars
            starRatings.push(rating)
            reviewArr.push(reviews)
        });
        let sumRatings = starRatings.reduce((prevNum, currNum) => prevNum + currNum, 0)
        let avgRating = parseFloat((sumRatings/starRatings.length).toFixed(2))
        spot.avgRating = avgRating
        let j = spot.toJSON()
        delete j.Reviews
        return j
    });
    res.status(200).json({"Spots": finalSpots})
})
//get details of a Spot from an id---------------------

router.get("/:id", async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    spot = spot.toJSON()
    if (!spot) {
        res.status(400).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    // numReviews
    const reviews = await Review.findAll({
        where: {spotId :spot.id}
    })
    const numReviews = reviews.length
    //avgRating

    let avgRating = await Review.findAll({
    where: {
        spotId: spot.id
    },
    attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']],
    })
    avgRating = parseFloat(avgRating[0].toJSON().avgRating.toFixed(2))

    //-------------SpotImages
    const spotImage = await Image.findAll({
        where: {spotId: spot.id},
        attributes: ['id', 'url', 'preview']
        })

    //-------------Owner
    const owner = await User.findByPk(spot.ownerId)

    spot.previewImage = spotImage[0].url
    spot.numReviews = numReviews
    spot.avgRating = avgRating
    spot.SpotImages = spotImage
    spot.Owner = owner

    res.status(200).json(spot)
})

//Get Reviews by Spot Id---------------------------
router.get("/:id/reviews", async (req, res) => {

    let spot = await Spot.findByPk(req.params.id)

    if (!spot) {
        res.status(400).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    const reviews = await Review.findAll({
        where: {spotId: spot.id},
        include: [{
            model: User, attributes: ['id','firstName','lastName']
        }, {
            model: Image,
            attributes: ['id', 'url']
        }]
    })


    res.status(200).json({
        Reviews: reviews,
        // ReviewImages: reviewImages,
    })
})



//create a Spot

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

            res.status(201).json(newSpot)


})
//get all images
router.get("/:id/images",  async (req, res) => {
    const images = await Image.findAll()
    res.status(200).json(images)
})

//create an Image for a Spot----------------DONE---------------------
router.post("/:id/images", requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.id);
    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    const { user } = req
    if (spot.ownerId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }

    const {url, preview } = req.body;

    if (preview === true) {
        spot.previewImage = url
        await spot.save()
    }

    const image = await spot.createImage({
        url, preview
    })
    image.toJSON().url = url
    image.toJSON().preview = preview
    let img = {id: image.id, url, preview }
    await image.save()
    res.status(200).json(img)
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
    const { spotId, review, stars} = req.body
    const { user } = req

    const reviews = await Review.findAll({
        where: {userId: user.id}
    })

    let userReview = false
    reviews.forEach(review => {
        let reviewJson = review.toJSON()
        if (reviewJson.spotId == spot.id){
            userReview = true
        }
    })



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
    if (userReview) {
        res.status(403).json({
            message: "User already has a review for this spot",
            statusCode: 403,
        })
    } else {
        const reviewy = await spot.createReview({
            userId: user.id,
            spotId, review, stars
        })

        res.status(200).json(reviewy)
    }
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
        res.status(200).json({Bookings: bookings})
    }

    if (spot.ownerId === user.id) {
        const bookings = await Booking.findAll({
            where: {spotId: spot.id},
            include: {model: User, attributes: ['id','firstName','lastName']},
        })
        res.status(200).json({Bookings: bookings})
    }
})

//create a Booking based on a Spot id---------------------------
router.post("/:id/bookings", requireAuth,  async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)

    if (!spot) {
        res.status(200).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    const { user } = req
    const {spotId, startDate, endDate} = req.body

    let errors = [];
    if (new Date(startDate) >= new Date(endDate)) errors.push("endDate cannot be on or before startDate")

    let thisDateRange = moment.range(startDate, endDate)

    if (errors.length) {
        res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors
        })
    }
    const bookingsActive = await Booking.findAll()
    bookingsActive.forEach(booking => {
        let range = moment.range(booking.startDate, booking.endDate)
        if (thisDateRange.overlaps(range)) {
            let errs = [];
            let start = moment(startDate)
            let end = moment(endDate)
            if(start.within(range)) errs.push("Start date conflicts with an existing booking")
            if(end.within(range)) errs.push("End date conflicts with an existing booking")

            res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errs
            })
        }
    })

    const booking = await spot.createBooking({
        userId: user.id,
        spotId, startDate, endDate
    })
    res.status(200).json({
        message: "The Booking was successful",
        booking
    })
})



//edit a Spot
router.put("/:id", spotCheck, requireAuth, async (req, res) => {
    const { id, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt} = req.body;
    let spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    const { user } = req
    if (spot.ownerId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }
    spot.id = id,
    spot.address = address,
    spot.city = city,
    spot.state = state,
    spot.country = country,
    spot.lat = lat,
    spot.lng = lng,
    spot.name = name,
    spot.description = description,
    spot.price = price


    } else {
        let updatedSpot = {id, ownerId:user.id, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt}
        await spot.save()
        res.status(200).json(updatedSpot)
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
