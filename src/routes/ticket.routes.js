import express from "express";
import tickets from "../data/tickets.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Tickets retrieved successfully",
        data: tickets
    });
})

router.get("/:id", (req, res) => {
    const ticket = tickets.find(t => t.id === parseInt(req.params.id));
    res.status(200).json({
        success: true,
        message: "Ticket retrieved successfully",
        data: ticket
    });
})

router.post("/", (req, res) => {
    const {title, priority} = req.body;

    // Validate title
    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }

    // Validate priority
    const allowedPriorities = ["low", "medium", "high"];
    if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
            success: false,
            message: "Priority must be low, medium, or high"
        });
    }

    // Generate a new ticket ID
    const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;

    // Create a new ticket object
    const newTicket = {
        id: newId,
        title: title.trim(),
        priority: priority,
        status: "open"
    };

    // Add the new ticket to the tickets array
    tickets.push(newTicket);

    // Send a success response with the newly created ticket
    res.status(201).json({
        success: true,
        message: "Ticket created successfully",
        data: newTicket
    });
});

router.put("/:id", (req, res) => {
    // Find the ticket by ID
    const ticketId = parseInt(req.params.id);
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Ticket not found"
        });
    }
    
    // Update the ticket's title and priority if provided
    const { title, priority } = req.body;
    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title must be a non-empty string"
            });
        }
        tickets[index].title = title.trim();
    }
    if (priority) {
        const allowedPriorities = ["low", "medium", "high"];
        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Priority must be low, medium, or high"
            });
        }
        tickets[index].priority = priority;
    }

    // Send a success response with the updated ticket
    res.status(200).json({
        success: true,
        message: "Ticket updated successfully",
        data: tickets[index]
    });
});

router.delete("/:id", (req, res) => {
    // Find the ticket by ID
    const ticketId = parseInt(req.params.id);
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Ticket not found"
        });
    }

    // Remove the ticket from the tickets array
    const deletedTicket = tickets.splice(index, 1)[0];

    // Send a success response with the deleted ticket
    res.status(200).json({
        success: true,
        message: "Ticket deleted successfully",
        data: deletedTicket
    });
})

export default router;