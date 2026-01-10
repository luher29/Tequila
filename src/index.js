//ES el punto de arranque de la aplicación
import "./database.js";
import app from "./app.js";

//Start server
app.listen(app.get("port"), () =>
    console.log("Server Listening on http://localhost:" + app.get("port") + "/api/students/getAll"
    ));
