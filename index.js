// 1. dotenv (PRIMEIRA LINHA)
import 'dotenv/config';

// 2. Imports de framework e libs
import express from 'express';
import cors from 'cors';

// 3. Imports de middlewares
import logger from './middlewares/logger.js';
import tratarErro from './middlewares/erro.js';

// 4. Imports de rotas
import alunosRouter from './routes/alunos.js';
import mensagensRouter from './routes/mensagens.js';

// 5. App e configuração
const app = express();
const PORT = process.env.PORT || 3000;

// 6. Middlewares globais — antes das rotas, na ordem correta
app.use(cors());            // 1º — libera CORS
app.use(express.json());    // 2º — parseia body JSON
app.use(logger);            // 3º — registra log

// 7. Rotas raiz
app.get('/', (req, res) => {
  res.json({ mensagem: 'Yearbook API está no ar! 🎓' });
});

app.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 8. Routers de recursos
app.use('/alunos', alunosRouter);
app.use('/mensagens', mensagensRouter);

// 9. Middleware de erro — POR ÚLTIMO, depois de todas as rotas
app.use(tratarErro);

// 10. Iniciar servidor localmente (Vercel ignora)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// 11. Exportar app para a Vercel usar como serverless function
export default app;