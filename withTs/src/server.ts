import express, { Request, Response } from 'express';
import { errorHandler } from './middlewares/errors/customeErrorHandler';
import { CustomRequest, ResolveUseByIndex } from './middlewares/resolveUserByIndex'; // Adjust the import path based on your structure
import { getXataClient } from './xata';

const app = express();
const xata = getXataClient();
// app.use(errorHandler(error, req, res, next))
app.use(express.json());
app.use(errorHandler)


// Get all events
app.get("/api/v1/events", async (req: Request, res: Response): Promise<void> => {

    try {
        const { records } = await xata.sql`SELECT * FROM "events"`; // Using SQL to select all events
        res.status(200).json(records);
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error });
    }
});


// Get an event by ID
// app.get("/api/v1/events/:id", ResolveUseByIndex(eventsData), async (req: Request, res: Response): Promise<void> => {
//     const customreq = req as CustomRequest;
//     const eventID = req.params.id;
//     try {
//         const { records } = await xata.sql`SELECT * FROM "events" WHERE id = ${eventID}`;
//         if (records.length === 0) {
//             res.status(404).json({ message: "Event not found" });
//         }
//         res.status(200).json(records[0]);
//     } catch (error: any) {
//         res.status(500).json({ message: "An error occurred", error });
//     }
// });

app.get("/api/v1/events/:id", ResolveUseByIndex(), (req: Request, res: Response) => {
    const customReq = req as CustomRequest;


    if (!customReq.userFound !== undefined) {
        res.status(404).json({
            message: "Data not available",
        });
    }

    // Return the event data found by the middleware
    res.status(200).json({
        message: "Event Found",
        data: customReq.userFound,
    });
});

// Create a new event
import { check, validationResult } from "express-validator";

// Validation Middleware
const validateEvent = [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('date').isISO8601().withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
    check('location').not().isEmpty().withMessage('Location is required'),
    check('imageUrl').isURL().withMessage('Image URL must be valid'),
    check('company').not().isEmpty().withMessage('Company is required'),
    check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
];

// const errors = validationResult(req);

// POST Route with Validation
app.post("/api/v1/events", validateEvent, async (req: Request, res: Response): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    const { title, date, location, imageUrl, company, price } = req.body;

    try {
        await xata.sql`INSERT INTO "events" (imageUrl, title, price, date, location, company) 
                       VALUES (${imageUrl}, ${title}, ${price}, ${date}, ${location}, ${company})`; // Insert new event

        res.status(201).json({ message: "Event created successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Update an event by ID
app.put("/api/v1/events/:id", validateEvent, ResolveUseByIndex(), async (req: Request, res: Response): Promise<void> => {
    const customReq = req as CustomRequest;
    const errors = validationResult(req);// Casting req to CustomRequest to access parsed data
    const eventID = customReq.parsedID; // Event ID retrieved by the middleware
    const { title, date, location, price, company, imageUrl } = req.body; // Additional fields for the event

    try {
        // Perform the update using the event ID and new data provided in the request body
        const result = await xata.sql`
            UPDATE "events" 
            SET 
                title = ${title}, 
                date = ${date}, 
                location = ${location},
                price = ${price},
                company = ${company},
                imageUrl = ${imageUrl}
            WHERE id = ${eventID}`;

        // Check if the update affected any rows
        if (!result) {
            res.status(404).json({ errors: errors.array() });
        }

        // Return success response after the update
        res.status(200).json({ message: "Event updated successfully" });
    } catch (error: any) {
        // Catch and handle any errors that occur during the update
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Delete an event by ID
app.delete("/api/v1/events/:id", async (req: Request, res: Response): Promise<void> => {
    const eventID = req.params.id;
    try {
        const result = await xata.sql`DELETE FROM "events" WHERE id = ${eventID}`; // Delete event
        if (!result) {
            res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error });
    }
});


// Validation Middleware (same as before)
// Updated PATCH route
app.patch("/api/v1/events/:id", validateEvent, ResolveUseByIndex(), async (req: Request, res: Response): Promise<void> => {
    // Validation errors handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    const eventID = req.params.id;
    const { imageUrl, title, price, date, location, company } = req.body;

    try {
        // Dynamically build the update SQL query based on the provided fields
        const updateFields: string[] = [];
        const values: (string | number | undefined | unknown)[] = [];

        if (imageUrl) {
            updateFields.push(`imageUrl = ?`);
            values.push(imageUrl);
        }
        if (title) {
            updateFields.push(`title = ?`);
            values.push(title);
        }
        if (price !== undefined) {
            updateFields.push(`price = ?`);
            values.push(price);
        }
        if (date) {
            updateFields.push(`date = ?`);
            values.push(date);
        }
        if (location) {
            updateFields.push(`location = ?`);
            values.push(location);
        }
        if (company) {
            updateFields.push(`company = ?`);
            values.push(company);
        }

        // If no fields were provided for update, return a 400 error
        if (updateFields.length === 0) {
            res.status(400).json({ message: "No fields to update" });
        }
        type SQLQuery = any;
        // Prepare the final SQL query
        const query: SQLQuery = `UPDATE "events" SET ${updateFields.join(', ')} WHERE id = ?`;
        values.push(eventID); // Append event ID to the values array

        // Execute the query with values
        const result = await xata.sql(query, ...values);

        // If no row was updated, return a 404 error
        if (!result) {
            res.status(404).json({ message: "Event not found" });
        }

        // Success response
        res.status(200).json({ message: "Event updated successfully" });
    } catch (error: any) {
        // Error handling
        res.status(500).json({ message: "An error occurred", error });
    }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
