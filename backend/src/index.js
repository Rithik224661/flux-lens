import express from 'express';
import cors from 'cors';
import logsRouter from './logs.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/logs', logsRouter);

app.get('/', (req, res) => {
  res.send('Flux Lens Log Ingestion Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
