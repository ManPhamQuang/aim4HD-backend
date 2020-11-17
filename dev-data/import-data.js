const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../config.env` });
const mongoose = require("mongoose");
const User = require("../models/User");
const Skill = require("../models/Skill");
const Post = require("../models/Post");
const Course = require("../models/Course");
const School = require("../models/School");

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
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, "utf8")
);
const schools = JSON.parse(
  fs.readFileSync(`${__dirname}/schools.json`, "utf8")
);
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, "utf8"));

const importData = async () => {
  try {
    await User.create(users, {
      validateBeforeSave: false,
    });
    await Skill.create(skills, {
      validateBeforeSave: false,
    });
    await Course.create(courses, {
      validateBeforeSave: false,
    });
    await School.create(schools, {
      validateBeforeSave: false,
    });
    await Post.create(posts, {
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
    await School.deleteMany();
    await Course.deleteMany();
    await Post.deleteMany();
    console.log("DATA SUCCESSFULLY DELETED");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") importData();
else if (process.argv[2] === "--delete") deleteData();
