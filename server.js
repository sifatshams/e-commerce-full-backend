import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';

// .env
const port = process.env.PORT || 5000;

// first of all connect the db then start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
