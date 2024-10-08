import express, { Request, Response } from 'express';
import { getXataClient } from './xata'; // Adjust the import path based on your structure

const app = express();
const xata = getXataClient();
app.use(express.json());

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
app.get("/api/v1/events/:id", async (req: Request, res: Response): Promise<void> => {
    const eventID = req.params.id;
    try {
        const { records } = await xata.sql`SELECT * FROM "events" WHERE id = ${eventID}`; // Fetch event by ID
        if (records.length === 0) {
            res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(records[0]);
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error });
    }
});

// Create a new event
app.post("/api/v1/events", async (req: Request, res: Response): Promise<void> => {
    const { title, date, location, imageUrl, company, price } = req.body; // Ensure these match your table columns
    try {
        await xata.sql`INSERT INTO "events" (imageUrl,title,price,date,location,company) VALUES (${imageUrl},${title},${price},${date}, ${location},${company})`; // Insert new event
        res.status(201).json({ message: "Event created successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error });
    }
});

// Update an event by ID
app.put("/api/v1/events/:id", async (req: Request, res: Response): Promise<void> => {
    const eventID = req.params.id;
    const { title, date, location } = req.body; // Ensure these match your table columns
    try {
        const result = await xata.sql`UPDATE "events" SET title = ${title}, date = ${date}, location = ${location} WHERE id = ${eventID}`; // Update event
        // if (result.affectedRows === 0) {
        //     res.status(404).json({ message: "Event not found" });
        // }
        res.status(200).json({ message: "Event updated successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error });
    }
});

// Delete an event by ID
app.delete("/api/v1/events/:id", async (req: Request, res: Response): Promise<void> => {
    const eventID = req.params.id;
    try {
        const result = await xata.sql`DELETE FROM "events" WHERE id = ${eventID}`; // Delete event
        // if (result.affectedRows === 0) {
        //     res.status(404).json({ message: "Event not found" });
        // }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error });
    }
});

// app.patch("/api/v1/events/:id", async (req: Request, res: Response): Promise<void> => {
//     const eventID = req.params.id;
//     const { imageUrl, title, price, date, location, company } = req.body; // Destructure fields from request body

//     try {
//         // Build the update SQL query dynamically based on provided fields
//         const updateFields: string[] = [];
//         const values: (string | number | undefined)[] = [];

//         if (imageUrl) {
//             updateFields.push(`imageUrl = ?`);
//             values.push(imageUrl);
//         }
//         if (title) {
//             updateFields.push(`title = ?`);
//             values.push(title);
//         }
//         if (price !== undefined) {
//             updateFields.push(`price = ?`);
//             values.push(price);
//         }
//         if (date) {
//             updateFields.push(`date = ?`);
//             values.push(date);
//         }
//         if (location) {
//             updateFields.push(`location = ?`);
//             values.push(location);
//         }
//         if (company) {
//             updateFields.push(`company = ?`);
//             values.push(company);
//         }

//         // If no fields to update, return a bad request response
//         if (updateFields.length === 0) {
//             res.status(400).json({ message: "No fields to update" });
//             return;
//         }

//         // Prepare the SQL query
//         const query = `UPDATE "events" SET ${updateFields.join(', ')} WHERE id = ?`;
//         values.push(eventID); // Add the event ID to the end of the values array

//         // Execute the update query
//         const result = await xata.sql(...values);

//         // Check if any row was updated
//         // if (result.affectedRows === 0) {
//         //     res.status(404).json({ message: "Event not found" });
//         //     return;
//         // }

//         res.status(200).json({ message: "Event updated successfully" });
//     } catch (error: any) {
//         res.status(500).json({ message: "An error occurred", error });
//     }
// });



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
