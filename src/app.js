//Aquí se genera la instancia de express (la pura configuración, no se inicializa)
import express from 'express';
import morgan from 'morgan';
import distributors from './routes/distributors.routes.js';
import products from './routes/products.routes.js';
import cors from 'cors';
//*import ejs from 'ejs';

const app = express();

//Settings (set)
app.disable('x-powered-by');
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", "./src/views");

//Midderware (use)
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

app.use('/api/products', products);
//app.use('/api/notes', noteRoutes);
app.use('/api/distributors', distributors);

export default app;