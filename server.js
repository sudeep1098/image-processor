import express from "express";
import dotenv from "dotenv";
import healthRoute from "./routes/health.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/health", healthRoute);

app.use('/', (req, res) => {
  res.send('Welcome to the Image Processor API');
});

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
// })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
