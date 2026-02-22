import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import addressRoutes from './routes/addressRoutes';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Setup uploads directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Basic health check
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'PEAK E-Commerce API is running.' });
});

// E-commerce Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);

// File Upload Route
app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
