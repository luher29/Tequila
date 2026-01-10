//Aquí se genera la instancia de express (la pura configuración, no se inicializa)
import express from 'express';
import morgan from 'morgan';
//*import ejs from 'ejs';

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

export default app;