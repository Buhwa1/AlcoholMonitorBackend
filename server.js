require("dotenv").config();

const express = require("express");
const userRoutes = require("./src/routes/user");

const app = express();
const mongoose = require("mongoose");

app.use(express.json());

app.use("/api/user", userRoutes);

// app.use("/api/workouts", workoutRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen on port
    app.listen(process.env.PORT, () => {
      console.log("Listening for requests on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// app.get("/", (req, res) => {
//   res.send("Welcome to my server!");
// });

// app.get("/login", (req, res) => {
//   res.send("Welcome to my login!");
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const express = require("express");

// //express app
// const app = express();
// const mongoose = require("mongoose");

// app.use(express.json());

// app.use("/api/workouts", workoutRoutes);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     //listen on port
//     app.listen(process.env.PORT, () => {
//       console.log("Listening for requests on port", process.env.PORT);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });
