import 'dotenv/config';
import app from './app'

const API_PORT = process.env.PORT || 8080;

app.listen(API_PORT, () => {
  console.log(`App is running http://localhost:${API_PORT}/`);
});