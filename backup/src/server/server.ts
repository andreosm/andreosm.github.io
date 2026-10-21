// import express from "express";
// import path from "path";

// const app = express();

// const PORT = process.env.PORT || 3000;

// // Public directory is located at the project root.
// const publicPath = path.join(process.cwd(), "public");

// // Serve everything under /public
// app.use(express.static(publicPath));

// app.use(
//   "/bootstrap-icons",
//   express.static(path.join(__dirname, "../node_modules/bootstrap-icons")),
// );

// // Home page
// app.get("/", (_req, res) => {
//   res.sendFile(path.join(publicPath, "index.html"));
// });

// app.listen(PORT, () => {
//   console.log(`Party website running at http://localhost:${PORT}`);
// });

import express from "express";
import path from "path";

const app = express();

const PORT = process.env.PORT || 3000;

// ============================================================
// PATHS
// ============================================================

// Public directory is located at the project root.
const publicPath = path.join(process.cwd(), "public");

// EJS views are located under src/views.
const viewsPath = path.join(process.cwd(), "src", "views");

// ============================================================
// VIEW ENGINE
// ============================================================

app.set("view engine", "ejs");

app.set("views", viewsPath);

// ============================================================
// STATIC FILES
// ============================================================

// Serve everything under /public.
app.use(express.static(publicPath));

// Serve Bootstrap Icons.
app.use(
  "/bootstrap-icons",
  express.static(path.join(process.cwd(), "node_modules", "bootstrap-icons")),
);

// ============================================================
// ROUTES
// ============================================================

// Home page
app.get("/index", (_req, res) => {
  res.render("index");
});

// The Party
app.get("/party", (_req, res) => {
  res.render("party");
});

// Be a Star
app.get("/star", (_req, res) => {
  res.render("star");
});

// The Venue
app.get("/venue", (_req, res) => {
  res.render("venue");
});

// Be a Star
app.get("/star", (_req, res) => {
  res.render("star");
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`Party website running at http://localhost:${PORT}`);
});