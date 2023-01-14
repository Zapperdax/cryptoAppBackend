const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");
const userRoute = require("./routes/userRoute");
const otpRoute = require("./routes/otpRoute");

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(userRoute);
app.use(otpRoute);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
