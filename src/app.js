//Aquí se genera la instancia de express y se configuran los middlewares y las rutas
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import productRoutes from './routes/products.routes.js';
import noteRoutes from './routes/notes.routes.js';
import distributorRoutes from './routes/distributors.routes.js';
import mermaRoutes from './routes/mermas.routes.js';

const app = express();

//Settings (set)
app.disable('x-powered-by');
app.set("port", process.env.PORT || 3000);

//Midderware (use)
app.use(cors()); // Permite peticiones del frontend
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/distributors', distributorRoutes);
app.use('/api/mermas', mermaRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor Tequila funcionando correctamente' });
});

export default app;