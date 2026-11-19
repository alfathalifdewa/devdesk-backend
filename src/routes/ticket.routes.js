import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// GET /tickets - Retrieve all tickets with pagination

router.get("/", async (req, res) => {
    try {
        // Pagination parameters
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        // Validate page
        if (!Number.isSafeInteger(page) || page <=0) {
            return res.status(400).json({
                success: false,
                message: "Invalid page number. It must be a positive integer"
            });
        }

        // Validate limit
        if(!Number.isSafeInteger(limit) || limit <1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Invalid limit. It must be a positive integer between 1 and 100"
            });
        }
        // Calculate the offset for pagination
        const offset = (page - 1) * limit;
        if (!Number.isSafeInteger(offset)) {
            return res.status(400).json({
                success: false,
                message: "Invalid offset calculated from page and limit"
            });
        }

        // Query the database for tickets with pagination
        
        // const result = await pool.query("SELECT * FROM tickets ORDER BY id ASC LIMIT $1 OFFSET $2", [limit, offset]);
        // const countResult = await pool.query("SELECT COUNT(*) FROM tickets");

        // New Version: Use a single query to get both the tickets and the total count
        const [result, countResult] = await Promise.all([
            pool.query("SELECT * FROM tickets ORDER BY id ASC LIMIT $1 OFFSET $2", [limit, offset]),
            pool.query("SELECT COUNT(*) FROM tickets")
        ]);
        const totalItems = Number(countResult.rows[0].count);;
        const totalPages = Math.ceil(totalItems / limit);
        
        // Return the tickets along with pagination info
        res.status(200).json({
            success: true,
            message: "Tickets retrieved successfully",
            data: result.rows,
            pagination: {
                currentPage: page,
                limit,
                totalItems,
                totalPages
            }
        });
    } catch (error) {
        console.error("Error retrieving tickets:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving tickets"
        });
    }
});

// GET /tickets/:id - Retrieve a specific ticket by ID

router.get("/:id",  async (req, res) => {
    try {
        const ticketId = Number(req.params.id);
        if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid ticket ID"
            });
        }
        const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [ticketId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Ticket retrieved successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error("Error retrieving ticket:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the ticket"
        });
    }
});

// POST /tickets - Create a new ticket

router.post("/", async (req, res) => {
    try {
        const { title, priority, user_id } = req.body;
        // Validate title
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required and must be a non-empty string"
            });
        }
        // Validate priority
        const allowedPriorities = ["low", "medium", "high"];
        if (!priority || !allowedPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Invalid priority. Allowed values are: low, medium, high"
            });
        }

        // Validate user_id
        const userId = Number(user_id);
        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID. It must be a positive integer"
            });
        }

        // Save the ticket to the database
        const result = await pool.query(
            `INSERT INTO tickets (title, priority, user_id) VALUES ($1, $2, $3) RETURNING *`, [title.trim(), priority, userId]
        );
        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating ticket:", error.message);

        // Foreign key violation error handling
        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID. The specified user does not exist"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Internal server error while creating the ticket"
        });
    }
});

// PUT /tickets/:id - Update an existing ticket

router.put("/:id", async (req, res) => {
    try {
        const ticketId = Number(req.params.id);
        const { title, priority, status } = req.body;

        // Validate ticket ID
        if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid ticket ID. It must be a positive integer"
            });
        }

        // Validate title
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required and must be a non-empty string"
            });
        }

        // Validate priority
        const allowedPriorities = ["low", "medium", "high"];
        if (!priority || !allowedPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Invalid priority. Allowed values are: low, medium, high"
            });
        }

        // Validate status
        const allowedStatuses = ["open", "in_progress", "resolved"];
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed values are: open, in_progress, resolved"
            });
        }

        const result = await pool.query(
            `UPDATE tickets SET title = $1,
            priority = $2,
            status = $3
            WHERE id = $4 RETURNING *`, [title.trim(), priority, status, ticketId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating ticket:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the ticket"
        });
    }
});

// DELETE /tickets/:id - Delete a ticket by ID

router.delete("/:id", async (req, res) => {
    try {
        const ticketId = Number(req.params.id);

        // Validate ticket ID
        if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid ticket ID. It must be a positive integer"
            });
        }
        
        const result = await pool.query(
            `DELETE FROM tickets WHERE id = $1 RETURNING *`, [ticketId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully",
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === "23503") {
            return res.status(409).json({
                success: false,
                message: "Cannot delete ticket. It is referenced by other records."
            });
        }

        console.error("Error deleting ticket:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the ticket"
        });
    }
});

export default router;