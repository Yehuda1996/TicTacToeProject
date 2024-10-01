import express from 'express';
import gameRoute from './route/userRoute.js';
import userRoutes from './route/userRoute.js';
// import errorHandler from './middleware/errorHandler.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use('/games', gameRoute);
app.use('/users', userRoutes);

// Error handling middleware
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});