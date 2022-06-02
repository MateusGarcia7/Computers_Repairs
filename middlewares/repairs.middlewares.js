const { Repair } = require("../Models/repairs.model");
const { AppError } = require("../Utils/appError");
const { catchAsync } = require("../Utils/catchAsync");



const pendingRepairExist = catchAsync( async (req, res, next) => {
    
      const { id } = req.params;
      const repair = await Repair.findOne({ where: { id, status: "pending" } });
      if (!repair) {
        return next(new AppError('no pending repair found with that id', 404))
      }
      req.repair = repair
      next();
   
  })

module.exports = { pendingRepairExist };
