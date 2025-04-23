import express from "express";
import path from "path";

const app = express();

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("static/circles.html"));
});

app.listen(3000, () => {
  console.log("Started server.");
});
