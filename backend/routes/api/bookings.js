const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');

const { User , Spot} = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//get all current User's Bookings--------------------------------------
router.get('/current', async (req, res) => {

    res.status(200).json()
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
