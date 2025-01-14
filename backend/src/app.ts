import express from "express";
import admin_route from "./routes/admin.route";
import user_route from "./routes/user.route";
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import recruiter_route from "./routes/recruiter.route";
import doctor_route from "./routes/doctor.route";
import { connectToDb } from "./config/db.config";

const app = express();
const PORT = 4040;

connectToDb().catch(console.dir);

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use("/admin", admin_route);
app.use("/recruiter",recruiter_route)
app.use("/doctor",doctor_route)
app.use("/", user_route);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
