import 'dotenv/config';
import app from './app'

const API_PORT = process.env.PORT;

app.listen(API_PORT, () => {
  console.log(`App is running http://localhost:${API_PORT}/`);
});