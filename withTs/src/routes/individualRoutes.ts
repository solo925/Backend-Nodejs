import express, { Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { CustomRequest, ResolveUseByIndex } from '../middlewares/resolveUserByIndex';
import { validateEventSchema } from '../middlewares/validators/validationSchema';
import { getXataClient } from '../xata';

const router = express.Router();
const xata = getXataClient();

// Get event by ID
router.get('/:id', ResolveUseByIndex(), (req, res): void => {
    const customReq = req as CustomRequest;
    if (!customReq.userFound) {
        res.status(404).json({
            message: "Event not found",
        });
    }
    res.status(200).json({
        message: "Event found",
        data: customReq.userFound,
    });
});

// Update an event by ID
router.put('/:id', checkSchema(validateEventSchema), ResolveUseByIndex(), async (req: Request, res: Response): Promise<void> => {
    const customReq = req as CustomRequest;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    const eventID = customReq.parsedID;
    const { title, date, location, price, company, imageUrl } = req.body;

    try {
        const result = await xata.sql`
            UPDATE "events" 
            SET title = ${title}, date = ${date}, location = ${location},
                price = ${price}, company = ${company}, imageUrl = ${imageUrl}
            WHERE id = ${eventID}`;

        if (!result) {
            res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Delete an event by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const eventID = req.params.id;
    try {
        const result = await xata.sql`DELETE FROM "events" WHERE id = ${eventID}`;
        if (!result) {
            res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "An error occurred", error });
    }
});

export default router;
