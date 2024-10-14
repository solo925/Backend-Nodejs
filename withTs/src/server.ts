import express from 'express';
import { errorHandler } from './middlewares/errors/customeErrorHandler';
import routes from './routes'; // Import the main route file

const app = express();

app.use(express.json());
app.use(errorHandler);

// Use routes
app.use('/api/v1', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
