import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import allRoutes from './routes/index.js';

const corsOptions = {
    origin: "http://localhost:3000" // frontend URI (ReactJS)
}

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

// routes

app.use('/api', allRoutes);
app.use((err,req,res,next) =>{
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error" ;

  return res.status(status).json({message,stack:err.stack})
})

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log('mongodb connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running at port ${PORT}`);
});
