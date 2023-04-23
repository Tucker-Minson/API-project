const express = require('express')
const { requireAuth } = require('../../utils/auth');

const { Spot, User, Image, Review} = require("../../db/models");

const sequelize = require('sequelize')
const Op = sequelize.Op
const router = express.Router();


// Delete a Review Image
router.delete("/:id", requireAuth, async(req, res) => {
    const image = await Image.findByPk(req.params.id,
        {
            include: {model: Review}
        })
    if (!image) {
        res.status(404).json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
        return
    }
    const { user } = req
    console.log(image)
    if (image.Review.userId !== user.id) {
        res.json({
            message: "Validation error",
            statusCode: 400,
        })
        return
    }
    await image.destroy()
    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
});


module.exports = router;
