//Aquí se genera la instancia de express y se configuran los middlewares y las rutas
import express from 'express';
import morgan from 'morgan';
//*import ejs from 'ejs';
import productRoutes from './routes/products.routes.js';
import noteRoutes from './routes/notes.routes.js';
import distributorRoutes from './routes/distributors.routes.js';

const app = express();

//Settings (set)
app.disable('x-powered-by');
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", "./src/views");

//Midderware (use)
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use('/api/products', productRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/distributors', distributorRoutes);
export default app;