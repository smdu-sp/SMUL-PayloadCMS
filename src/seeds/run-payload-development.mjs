import { bin } from "../../node_modules/payload/dist/bin/index.js";

process.env.NODE_ENV = "development";

await bin();
