const { db } = require("./Utils/database");
const {app} = require('./app');
const {User} = require('./Models/user.model')
const {Repair} = require('./Models/repairs.model')
const express = require("express");
db.authenticate()
  .then(() => console.log("database authenticated"))
  .catch((err) => console.log(err));


User.hasMany(Repair);
Repair.belongsTo(User);


db.sync()
  .then(() => console.log("database synced"))
  .catch((err) => console.log(err));

const PORT = 4000;


app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});
