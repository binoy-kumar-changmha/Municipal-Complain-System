const complain = require("../models/citizenComplain")

const deleteComplain = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const userId = req.user.userId;
        const deletedComplaint = await complain.findOneAndDelete({
            _id: complaintId,
            userId: userId
        });

        if (!deletedComplaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found or you are not authorized to delete it"
            });
        }

        res.status(200).json({
            success: true,
            message: "Complaint deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = { deleteComplain };