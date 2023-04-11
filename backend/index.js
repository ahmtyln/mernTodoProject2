import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import allRoutes from './routes/index.js';


const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

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
