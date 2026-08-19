const complain = require("../models/citizenComplain");

/*-------------------------------fetch complain--------------------------*/

const getAllComplains = async(req,res)=>{
    try{
       const complainList = await complain.find().sort({createdAt:-1});
       return res.status(200).json({
        success:true,
        complainList,
       })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports={getAllComplains}