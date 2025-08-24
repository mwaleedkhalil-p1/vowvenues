import express from "express";
import { registerRoutes } from "./routes";
import { importVenues } from "./import-venues";
import mongoose from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging API requests
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    });
  }
  next();
});

// Import venues before starting the server
(async () => {
  try {
    await mongoose.connection.once('open', async () => {
      await importVenues();
      console.log('Venues imported successfully');
    });
  } catch (error) {
    console.error('Failed to import venues:', error);
  }
})();

// Register routes
registerRoutes(app);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
export default app;