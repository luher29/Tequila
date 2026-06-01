import mongoose from "mongoose";
import "dotenv/config";

const URI = process.env.MONGODB_URI;

mongoose.connect(URI)
//then para responder que si hubo connecion
.then(()=>console.log("✅ MongoDB conectado a tequila_bd"))
//catch si hubo un error 
.catch((err)=>console.log("❌ Error de conexión:", err));

export default mongoose;