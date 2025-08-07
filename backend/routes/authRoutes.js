import express from'express';
const router = express.Router();

// Sample route
router.get("/", (req, res) => {
  res.send("Auth route working!");
});

export default router;