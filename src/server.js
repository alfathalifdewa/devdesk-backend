import "dotenv/config";
import app from "./app.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// }) ;

async function startServer() {
    try {
        const result = await pool.query ("SELECT current_database() AS database");
        console.log("Database Connected:", result.rows[0].database);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1); // Exit the process with an error code
    }
}

startServer();