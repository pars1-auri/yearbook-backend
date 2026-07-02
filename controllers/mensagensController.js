import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// GET /mensagens — lista todas as mensagens (mais recentes primeiro, com dados do autor)
export async function listarMensagens(req, res) {
  const mensagens = await prisma.mensagem.findMany({
    orderBy: { criadoEm: 'desc' },  // mais recente primeiro
    include: {
      autor: {                        // traz dados do autor junto
        select: {
          nome: true,                 // nome do autor
          fotoUrl: true,              // foto do autor
        },
      },
    },
  });
  res.json(mensagens); // retorna a lista com autor embutido
}

// --- Stubs para o desafio do aluno ---

// 🎯 POST /mensagens — cria uma nova mensagem
// Siga o mesmo padrão do criarAluno
// Valide que texto não está vazio (400 se faltar)
export async function criarMensagem(req, res) {
 try {
    // 1. Extraia texto, imagemUrl e autorId de req.body
    const { texto, imagemUrl, autorId } = req.body;

    // 2. Valide: se texto não existir, retorne 400
    if (!texto || texto.trim() === '') {
      return res.status(400).json({ error: 'O campo "texto" é obrigatório.' });
    }

    // 3. Crie com prisma.mensagem.create()
    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,
        autorId
      }
    });

    // 4. Retorne 201 com a mensagem criada
    return res.status(201).json(novaMensagem);

  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    return res.status(500).json({ error: 'Erro interno do servidor ao salvar a mensagem.' });
  }
}

// 🎯 DELETE /mensagens/:id — deleta uma mensagem
// Siga o mesmo padrão do deletarAluno
export async function deletarMensagem(req, res) {
 try {
    // 1. Extrai o id dos parâmetros da URL (req.params)
    const { id } = req.params;

    // 2. Tenta deletar no banco usando o ID convertido para número
    await prisma.mensagem.delete({
      where: {
        id: Number(id) // ⚠️ Importante: converte a string da URL para número inteiro
      }
    });

    // 3. Retorna 204 No Content se a deleção deu certo (sucesso sem corpo na resposta)
    return res.status(204).send();

  } catch (error) {
    console.error("Erro ao deletar mensagem:", error);

    // 4. Se o Prisma não encontrar o registro com esse ID, ele lança o erro 'P2025'
    if (error.code === 'P2025') {
      return res.status(404).json({ erro: 'Mensagem não encontrada.' });
    }

    // Para qualquer outro tipo de erro inesperado no banco
    return res.status(500).json({ erro: 'Erro interno ao deletar a mensagem.' });
  }
}
