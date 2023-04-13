const express = require('express')
const { requireAuth } = require('../../utils/auth');

const {User, Spot, Booking} = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// middleware for date checking

    //     --  validation  error
    //     --  statusCode: 400
    //         --->  "endDate cannot come before startDate"
    // -----------------------------------------------------



// --  "message": "Booking couldn't be found"
// --  statusCode: 404

// -----------------------------------------------------
// --  "message": "Past bookings can't be modified"
// --  statusCode: 403

// -----------------------------------------------------
// --  "message": "Sorry, this spot is already booked for the specified dates",
// --  "statusCode": 403,
//     --->  "Start date conflicts with an existing booking"
//     ---> "End date conflicts with an existing booking"
// -----------------------------------------------------


//get all current User's Bookings--------------------------------------
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const currentUserBookings = await Booking.findAll({
        where: {userId: user.id},
        include: {model: Spot}
    })

    res.status(200).json({
        "Bookings": currentUserBookings
    })
});

//edit a Booking-------------------------------------------------------
router.put('/:id', requireAuth ,async (req, res) => {
    let booking = await Booking.findByPk(req.params.id)
    if(!booking) {
        res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }
    const {user} = req;
    let errors = [];
    const {startDate, endDate} = req.body

    booking.startDate = new Date(startDate),
    booking.endDate = new Date (endDate)

    if (booking.userId !== user.id) errors.push('Invalid User')
    if (startDate >= endDate) errors.push("End date cannot come before start date")


    if (errors.length > 0) {
        const err = new Error('Validation error')
        err.statusCode = 400
        err.errors = errors
        res.status(400).json(err)
    }

    await booking.save()
    res.status(200).json(booking)
});

//delete a Booking-----------------------------------------------------
router.delete('/:id', requireAuth, async (req, res) => {
    let booking = await Booking.findByPk(req.params.id)
    if(!booking) {
        res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }
    const {user} = req

    if (booking.userId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }

    //add this Error fix for is user tries to delete booking after the start date
    // if (!booking) {
    //     res.status(403).json(        {
    //         message: "Bookings that have been started can't be deleted",
    //         statusCode: 403
    //     })
    // }
    await booking.destroy()
    res.status(200).json({
        message: "Successfully deleted"
    })
});
module.exports = router;
