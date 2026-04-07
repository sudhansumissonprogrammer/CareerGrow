import express from "express";

const contactRouter = express.Router();

contactRouter.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "name, email and message are required",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Message received successfully",
  });
});

export default contactRouter;
