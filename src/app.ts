import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: 'HospyFlow API is running' });
});

app.use('/api', router);

// Middleware de Erro Global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Log detalhado
    console.error('❌ Erro Global:', err);
    if (err instanceof Error) {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
});

export default app;
