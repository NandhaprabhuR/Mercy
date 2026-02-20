import cors from 'cors';
import postRoutes from './routes/postRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'PEAK Social Media API is running.' });
});

app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
