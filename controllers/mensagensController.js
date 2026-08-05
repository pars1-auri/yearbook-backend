import prisma from '../prisma/client.js';

// GET /mensagens
export async function listarMensagens(req, res, next) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { criadoEm: 'desc' },
      include: {
        autor: {
          select: {
            nome: true,
            fotoUrl: true,
          },
        },
      },
    });
    return res.json(mensagens);
  } catch (error) {
    next(error);
  }
}

// POST /mensagens
export async function criarMensagem(req, res, next) {
  try {
    // Garante que req.body existe para evitar TypeError
    const body = req.body || {};
    const { texto, autorId } = body;

    // 1. Valida se o texto está presente e não é apenas espaço em branco
    if (!texto || typeof texto !== 'string' || texto.trim() === '') {
      return res.status(400).json({ erro: 'O campo "texto" é obrigatório.' });
    }

    // 2. Valida se o autorId foi enviado e se é um número válido
    const idNumerico = Number(autorId);
    if (!autorId || Number.isNaN(idNumerico)) {
      return res.status(400).json({ erro: 'O campo "autorId" deve ser um número válido.' });
    }

    // 3. Busca o autor somente após garantir que idNumerico não é NaN
    const autorExistente = await prisma.aluno.findUnique({
      where: { id: idNumerico }
    });

    if (!autorExistente) {
      return res.status(400).json({ erro: 'O autorId fornecido não existe.' });
    }

    // 4. Criação da mensagem no banco
    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto: texto.trim(),
        autorId: idNumerico
      }
    });

    return res.status(201).json(novaMensagem);
  } catch (error) {
    next(error);
  }
}

// DELETE /mensagens/:id
export async function deletarMensagem(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.mensagem.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }
    next(error);
  }
}