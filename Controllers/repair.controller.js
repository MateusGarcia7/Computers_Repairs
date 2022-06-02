const { Repair } = require("../Models/repairs.model");
const { User } = require("../Models/user.model");
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { catchAsync } = require("../Utils/catchAsync");


const getAllCompletedRepair = catchAsync(async (req, res, next) => {
  const repair = await Repair.findAll({
    where: { status: "completed" },
    include: [{ model: User, attributes: ["id", "name", "email"] }],
  });
  res.status(200).json({
    repair,
  });
});



const getAllPendingRepair = catchAsync(async (req, res, next) => {
  const repair = await Repair.findAll({
    where: { status: "pending" },
    include: [{ model: User, attributes: ["id", "name", "email"] }],
  });

  res.status(200).json({
    repair,
  });
});

const getRepairById = catchAsync(async (req, res, next) => {
  const { repair } = req;
  
  const imgRef = ref(storage, repair.imgPath);
  const url = await getDownloadURL(imgRef);

  repair.imgPath = url;
  res.status(200).json({
    repair,
  });
});

const createRepair = catchAsync(async (req, res, next) => {
  const { date,  computerNumber, comments } = req.body;
  const {sessionUser} = req
  const newRepair = await Repair.create({
    date,
    userId: sessionUser.id, 
    computerNumber,
    comments,
    imgPath: '',
  });
  const imgRef = ref(
    storage,
    `repairs/${newRepair.id}-${Date.now()}-${req.file.originalname}`
  ); // Libreria de id unicos - uiid
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  newRepair.update({ imgPath: imgUploaded.metadata.fullPath });

  await new Email(sessionUser.email).sendCreate(sessionUser.name);
  res.status(201).json({ newRepair });
});

const updateRepair = catchAsync(async (req, res, next) => {
  const { repair, sessionUser } = req;
  await repair.update({ status: "completed" });
  await new Email(sessionUser.email).sendComplete(sessionUser.name);
  res.status(200).json({ status: "success" });
});

const deleteRepair = catchAsync(async (req, res, next) => {
  const { repair, sessionUser } = req;

  await repair.update({ status: "deleted" });
  await new Email(sessionUser.email).sendDelete(sessionUser.name);
  res.status(200).json({
    status: "succes",
  });
});

module.exports = {
  getAllCompletedRepair,
  getAllPendingRepair,
  createRepair,
  getRepairById,
  updateRepair,
  deleteRepair,
};
