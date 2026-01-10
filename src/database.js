import mongoose from "mongoose";

mongoose.connect("mongodb+srv://lupita29:luher29@lupita.vup0axr.mongodb.net/school_control?retryWrites=true&w=majority&appName=Lupita")
//then para responder que si hubo connecion
.then(()=>console.log("mongo db connected"))
//catch si hubo un error 
.catch((err)=>console.log(err));

export default mongoose;