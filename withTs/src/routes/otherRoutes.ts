import express, { Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { validateEventSchema } from '../middlewares/validators/validationSchema';
import { getXataClient } from '../xata';


const router = express.Router();
const xata = getXataClient();

// Get all events
router.get('/', async (req: Request, res: Response) => {
    try {
        const { records } = await xata.sql`SELECT * FROM "events"`;
        res.status(200).json(records);
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error });
    }
});

// Create a new event
router.post('/', checkSchema(validateEventSchema), async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    const { title, date, location, imageUrl, company, price } = req.body;

    try {
        await xata.sql`
            INSERT INTO "events" (imageUrl, title, price, date, location, company)
            VALUES (${imageUrl}, ${title}, ${price}, ${date}, ${location}, ${company})`;
        res.status(201).json({ message: "Event created successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

export default router;
