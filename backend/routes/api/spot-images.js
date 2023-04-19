const express = require('express')
const { requireAuth } = require('../../utils/auth');

const { Spot, User, Image, Review} = require("../../db/models");

const sequelize = require('sequelize')
const Op = sequelize.Op
const router = express.Router();

//Delete a Spot Image
router.delete("/:id", requireAuth, async(req, res) => {
    const image = await Image.findByPk(req.params.id)
    console.log('what up this is a console log -->', image)

    if (!image) {
        res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    }
    await image.destroy()
    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
});


module.exports = router;
