import express from 'express';
import { syncModels } from './models';

const app = express();

app.use(express.json());

// Test Route
app.get('/', async (req, res) => {
    res.json({ message: 'Hello, Sequelize!' });
});

// Sync models
syncModels();

export default app;
