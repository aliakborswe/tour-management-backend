import cors from "cors";
import express, { Request, Response } from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

const app = express()
app.use(cookieParser())
app.use(express.json());
app.use(cors())

app.use("/api/v1", router);


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})

// global error handler
app.use(globalErrorHandler)
// not found route handler
app.use(notFound)

export default app;