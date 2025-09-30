import app from "./app.js";
import { checkConnection } from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

checkConnection()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port http://localhost:${process.env.PORT}`);
        })
    })
    .catch((error) => console.error("Failed to connect to the database:", error));


