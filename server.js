const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./index");

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
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
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
