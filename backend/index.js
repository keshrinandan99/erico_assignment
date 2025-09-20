import express from "express";
import cors from "cors";
import userRoutes from './routes/user.routes.js'
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/user',userRoutes)


app.listen(PORT, () => {
  console.log(`Server listening on port:${PORT} `);
});
