const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const server = require("./index");

mongoose
    .connect(
        process.env.DATABASE.replace(
            "<password>",
            process.env.DATABASE_PASSWORD
        ),
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
    .then(() => console.log("CONNECTED TO DATABASE"))
    .catch((e) => console.log(e));

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("express and socket running on 5000");
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
