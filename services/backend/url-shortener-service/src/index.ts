import app from "./app";
import { env } from "./configs/env";

app.listen(env.PORT, () => {
    console.log(`URL Shortener running on port ${env.PORT}`);
});