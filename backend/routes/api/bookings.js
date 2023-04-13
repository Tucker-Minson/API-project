const express = require('express')
const { requireAuth } = require('../../utils/auth');

const {User, Spot, Booking} = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
router.put('/:id', async (req, res) => {

    res.status(200).json()
});

//delete a Booking-----------------------------------------------------
router.delete('/:id',requireAuth, async (req, res) => {
    let booking = await Booking.findByPk(req.params.id)
    const {user} = req

    if (booking.userId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
    }
    if (!booking) {
        res.status(404).json({
            message: "This Booking couldn't be found",
        })
    }
    await booking.destroy()
    res.status(200).json({
        message: "Successfully deleted"
    })
});
module.exports = router;
