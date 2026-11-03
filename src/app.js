import express from "express";
import ticketRoutes from "./routes/ticket.routes.js";

const app = express();

// Middleware
app.use(express.json());

app.use("/api/v1/tickets", ticketRoutes);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DevDesk API is running"
    });
});


export default app;