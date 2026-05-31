import mongoose from "mongoose";

mongoose.connect("mongodb+srv://lupita29:luher29@lupita.vup0axr.mongodb.net/tequila_bd?retryWrites=true&w=majority&appName=Lupita")
//then para responder que si hubo connecion
.then(()=>console.log("✅ MongoDB conectado a tequila_bd"))
//catch si hubo un error 
.catch((err)=>console.log("❌ Error de conexión:", err));

export default mongoose;