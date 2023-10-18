const express = require("express");
const basicAuth = require("basic-auth");
const Assignment = require("./models/assignment"); // Update the path to your models
const User = require("./models/user"); // Replace with your User model definition
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
// const { testDatabaseConnection } = require("./Config/config");
const sequelize = require("./config/config");
const app = express();
app.use(express.json());
app.use(bodyParser.raw({ type: "*/*", limit: "10mb" }));

// Test the database connection
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}

// Middleware to authenticate users with basic authentication
const authenticate = async (req, res, next) => {
  const user = basicAuth(req);
  console.log("The user issssssssssssssss  ", user);
  if (!user || !user.name || !user.pass) {
    res.status(401).send("Authentication required");
    console.log("Authentication failed");
    return;
  }

  // Replace this with your logic to fetch the user from the database by email

  const storedUser = await User.findOne({ where: { email: user.name } });
  console.log("This is the storedUser   ", storedUser);
  if (!storedUser) {
    res.status(401).send("Authentication failed");
    return;
  }

  // Compare the provided password with the stored hashed password
  const isValidPassword = await bcrypt.compare(user.pass, storedUser.password);
  if (!isValidPassword) {
    res.status(401).send("Authentication failed");
    return;
  }

  // Attach the userId to the request object for use in other middleware

  req.userId = storedUser.id;
  next();
};

// Get list of all assignments (public)
// app.get("/v1/assignments", authenticate, async (req, res) => {
//   const assignments = await Assignment.findAll();
//   res.json(assignments);
// });

app.get("/v1/assignments", authenticate, async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {
      res
        .status(400) // Bad Request
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .header("Pragma", "no-cache")
        .json({ error: "body not allowed for GET method" });
      return;
    }

    if (Object.keys(req.query).length > 0) {
      res

        .status(400) // Bad Request

        .header("Cache-Control", "no-cache, no-store, must-revalidate")

        .header("Pragma", "no-cache")

        .json({ error: "query not allowed for GET method" });

      return;
    }

    // Find assignments that belong to the authenticated user

    const assignments = await Assignment.findAll();

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create assignment (authenticated)

app.post("/v1/assignments", authenticate, async (req, res) => {
  console.log("I'm hereeeeee");

  console.log("User id   --->  ", req.userId);

  try {
    const { name, points, num_of_attempts, deadline } = req.body;

    const assignment = await Assignment.create({
      name,
      points,
      num_of_attempts,
      deadline,
      user_id: req.userId, // Assign the userId to the assignment
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// // Get assignment details (public)

// app.get("/v1/assignments/:id", authenticate, async (req, res) => {

//   const { id } = req.params;

//   const assignment = await Assignment.findByPk(id);

//   if (!assignment) {

//     res.status(404).json({ error: "Assignment not found" });

//   } else {

//     res.json(assignment);

//   }

// });

app.get("/v1/assignments/:id", authenticate, async (req, res) => {
  if (Object.keys(req.body).length > 0) {
    res

      .status(400) // Bad Request

      .header("Cache-Control", "no-cache, no-store, must-revalidate")

      .header("Pragma", "no-cache")

      .json({ error: "body not allowed for GET method" });

    return;
  }

  if (Object.keys(req.query).length > 0) {
    res

      .status(400) // Bad Request

      .header("Cache-Control", "no-cache, no-store, must-revalidate")

      .header("Pragma", "no-cache")

      .json({ error: "query not allowed for GET method" });

    return;
  }

  const { id } = req.params;

  const assignment = await Assignment.findByPk(id);

  if (!assignment) {
    res.status(404).json({ error: "Assignment not found" });
  } else {
    res.json(assignment);
  }
});

// Delete assignment (authenticated)

// app.delete("/v1/assignments/:id", authenticate, async (req, res) => {

//   const { id } = req.params;

//   const assignment = await Assignment.findByPk(id);

//   if (!assignment) {

//     res.status(404).json({ error: "Assignment not found" });

//   } else {

//     await assignment.destroy();

//     res.status(204).send();

//   }

// });

app.delete("/v1/assignments/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const assignment = await Assignment.findByPk(id);

  if (!assignment) {
    res.status(404).json({ error: "Assignment not found" });
  } else {
    // Check if the assignment belongs to the authenticated user

    if (assignment.userId !== req.userId) {
      res.status(403).json({ error: "Access denied" });
    } else {
      await assignment.destroy();

      res.status(204).send();
    }
  }
});

// // Update assignment (authenticated)

// app.put("/v1/assignments/:id", authenticate, async (req, res) => {

//   const { id } = req.params;

//   const { name, points, num_of_attempts, deadline } = req.body;

//   const assignment = await Assignment.findByPk(id);

//   if (!assignment) {

//     res.status(404).json({ error: "Assignment not found" });

//   } else {

//     assignment.name = name;

//     assignment.points = points;

//     assignment.num_of_attempts = num_of_attempts;

//     assignment.deadline = deadline;

//     await assignment.save();

//     res.json(assignment);

//   }

// });

app.put("/v1/assignments/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const { name, points, num_of_attempts, deadline } = req.body;

  const assignment = await Assignment.findByPk(id);

  if (!assignment) {
    res.status(404).json({ error: "Assignment not found" });
  } else {
    // Check if the assignment belongs to the authenticated user

    if (assignment.userId !== req.userId) {
      res.status(403).json({ error: "Access denied" });
    } else {
      assignment.name = name;

      assignment.points = points;

      assignment.num_of_attempts = num_of_attempts;

      assignment.deadline = deadline;

      await assignment.save();

      // res.json(assignment);

      res.status(204).send();
    }
  }
});

app.get("/healthz", async (req, res) => {
  try {
    // Test the database connection

    const isDatabaseConnected = await testDatabaseConnection();

    if (!isDatabaseConnected) {
      res

        .status(503) // Service Unavailable

        .header("Cache-Control", "no-cache, no-store, must-revalidate")

        .header("Pragma", "no-cache")

        .send();

      return;
    }

    if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
      res

        .status(400) // Bad Request

        .header("Cache-Control", "no-cache, no-store, must-revalidate")

        .header("Pragma", "no-cache")

        .send();

      return;
    }

    res

      .status(200)

      .header("Cache-Control", "no-cache, no-store, must-revalidate")

      .header("Pragma", "no-cache")

      .send();
  } catch (error) {
    console.error("Error in health check:", error);

    res

      .status(500) // Internal Server Error

      .header("Cache-Control", "no-cache, no-store, must-revalidate")

      .header("Pragma", "no-cache")

      .send();
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
