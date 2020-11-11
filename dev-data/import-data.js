const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../config.env` });
const mongoose = require("mongoose");
const User = require("../models/User");
const Skill = require("../models/Skill");

mongoose
  .connect(
    process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("CONNECT TO DATABASE"))
  .catch(e => console.log(e));

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf8"));
const skills = JSON.parse(fs.readFileSync(`${__dirname}/skills.json`, "utf8"));

const importData = async () => {
  try {
    await User.create(users, {
      validateBeforeSave: false,
    });
    await Skill.create(skills, {
      validateBeforeSave: false,
    });
    console.log("DATA SUCCESSFULLY INSERTED");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Skill.deleteMany();
    console.log("DATA SUCCESSFULLY DELETED");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") importData();
else if (process.argv[2] === "--delete") deleteData();
