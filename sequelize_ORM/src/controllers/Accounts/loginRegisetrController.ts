// import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import { User } from '../../models';
// import jwt from 'jsonwebtoken';

dotenv.config();

export const RegisterController: Router = express.Router();
export const loginController: Router = express.Router();



// Register Controller with Validation
RegisterController.post('/', async (req: Request, res: Response): Promise<void> => {
    const { name, email } = req.body;

    if (!name || !email) {
        res.status(404).json({ error: 'All fields are required' });
        return;
    }

    try {
        // Directly pass an object to User.create
        const newUser = await User.create({ name, email });
        res.status(200).json({ message: 'Created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user', details: error });
    }
});






// Login Route
// loginController.post('/', async (req: Request, res: Response): Promise<any> => {
//     const { email, password } = req.body;
//     const xata = getXataClient();

//     try {
//         // Fetch the user from Xata by email
//         const user = await xata.db.users.filter({ email }).getFirst();
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // Compare the provided password with the hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user.xata_id }, process.env.JWT_SECRET!, {
//             expiresIn: '1h',
//         });

//         return res.status(200).json({ token, message: 'Login successful', user });
//     } catch (error) {
//         return res.status(500).json({ message: 'Server error', error });
//     }
// });

export default { loginController, RegisterController };
