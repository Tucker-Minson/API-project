const express = require('express');
const router = express.Router();

const { Spot, User } = require("../../db/models");


router.get("/", async (req, res) => {
    const spots = await Spot.findAll()
    res.status(200).json(spots)
})


module.exports = router;
