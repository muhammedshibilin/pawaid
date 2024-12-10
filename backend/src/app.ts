import express from "express";
import admin_route from "./routes/admin.route";
import user_route from "./routes/user.route";
import connectToMongoDB from "./config/db";

const app = express();
const PORT = 4040;

connectToMongoDB()

app.use(express.json());

app.use("/admin", admin_route);
app.use("/", user_route);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
