import express from "express";
import path from "path";

const app = express();

const PORT = process.env.PORT || 3000;

// Public directory is located at the project root.
const publicPath = path.join(process.cwd(), "public");

// Serve everything under /public
app.use(express.static(publicPath));

app.use(
  "/bootstrap-icons",
  express.static(path.join(__dirname, "../node_modules/bootstrap-icons")),
);

// Home page
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Party website running at http://localhost:${PORT}`);
});
