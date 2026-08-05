// Middleware de log — registra cada requisição no terminal
export default function logger(req, res, next) {
  // 1. Marca o timestamp de quando a requisição chegou
  const inicio = Date.now();

  // 2. Escuta o evento 'finish', que dispara quando a resposta é enviada ao cliente
  res.on('finish', () => {
    // 3. Calcula a duração subtraindo o tempo inicial do tempo atual
    const duracao = Date.now() - inicio;
    
    // 4. Captura o status code que foi retornado (ex: 200, 201, 400, 500)
    const statusCode = res.statusCode;

    // 5. Exibe no terminal as informações formatadas
    console.log(`[${req.method}] ${req.url} - Status: ${statusCode} (${duracao}ms)`);
  });

  // 6. Passa o controle para o próximo middleware ou rota da aplicação
  next();
}