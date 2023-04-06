const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

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
router.delete('/:id', async (req, res) => {

    res.status(200).json()
});
module.exports = router;
