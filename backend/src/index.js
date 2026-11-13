import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

// Import modules after loading environment variables
const { default: connectDB } = await import("./db/connectDB.js");
const { app } = await import("./app.js");

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
    process.exit(1);
  });