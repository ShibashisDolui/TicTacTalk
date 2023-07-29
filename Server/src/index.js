import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { StreamChat } from "stream-chat";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "7ebqjnmptc4s";
const API_SECRET =
  "4ubbr8yfy69vfgzxshvw7yp4ajp6f9qdysf7d8kahn3pgcvmeej8ncxefx88vys7";

const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: username });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
    );

    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userId: users[0].id,
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    // Handle or log the error appropriately
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
