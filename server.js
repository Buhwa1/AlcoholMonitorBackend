require("dotenv").config();
const cors = require("cors");
const express = require("express");
const userRoutes = require("./src/routes/user");
const alcoholRoutes = require("./src/routes/alcohol");
const vitalsRoutes = require("./src/routes/vitals");

const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Listening for requests on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/alcohol", alcoholRoutes);
app.use("/api/vitals", vitalsRoutes);
