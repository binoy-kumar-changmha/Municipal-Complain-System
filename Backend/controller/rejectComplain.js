const complain = require("../models/citizenComplain");

const rejectComplain = async (req, res) => {
    try {
        const complaintId = req.params.id;

        const updatedComplaint = await complain.findByIdAndUpdate(
            complaintId,
            {
                status: "Rejected"
            },
            {
                new: true
            }
        );

        if (!updatedComplaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Complaint rejected successfully",
            complaint: updatedComplaint
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { rejectComplain };
