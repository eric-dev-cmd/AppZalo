const path = require("path");
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const port = 4000;

const route = require("./routers");
const db = require("./config/db");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");
const docs = require("./docs");
db.connect();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.engine("hbs", handlebars({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

app.use("/api/documentation", swaggerUI.serve, swaggerUI.setup(docs));

route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
