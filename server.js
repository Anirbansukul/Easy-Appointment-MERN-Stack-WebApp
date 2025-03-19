import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectc from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import path from 'path';
import { fileURLToPath } from 'url';
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectc()

app.use(express.json());
app.use(cors())

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter)
// console.log("Checking userRouter:", userRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send('API WORKING')

})
app.listen(port, () => console.log("Server Started", port))