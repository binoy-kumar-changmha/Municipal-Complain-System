const complain = require("../models/citizenComplain");

//----------------------------------user upload complain-------------------------//

const uploadComplain = async (req, res) => {
    try {
        const complainSubmit = await complain.create({
            userId: req.user.userId,
            name: req.body.name,
            phone: req.body.phone,
            type: req.body.type,
            description: req.body.description,
            location: req.body.location
        });
        res.status(201).json({
            success: true,
            message: 'Complain successfully submitted',
            complainSubmit
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { uploadComplain }

