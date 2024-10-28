import express from 'express';
import { syncModels } from './models';
import mainRoute from './routes/main';


const app = express();

app.use(express.json());

app.use('/api/v1', mainRoute);

// Test Route
app.get('/', async (req, res) => {
    res.json({ message: 'Hello, Sequelize!' });
});

// Sync models
syncModels();


export default app;
