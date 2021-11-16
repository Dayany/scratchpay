var express = require("express");
const port = process.env.PORT || 8080;
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ message: "Lols" });
});

app.listen(port, () => console.log(`Ready at port: ${[port]}`));
