import prisma from '../prisma/client.js';

const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
};

// GET /alunos
export async function listarAlunos(req, res, next) {
  try {
    const alunos = await prisma.aluno.findMany({
      select: selectSemSenha,
    });
    res.json(alunos);
  } catch (erro) {
    next(erro);
  }
}

// GET /alunos/:id
export async function buscarAluno(req, res, next) {
  try {
    const { id } = req.params;
    const aluno = await prisma.aluno.findUnique({
      where: { id: Number(id) },
      select: selectSemSenha,
    });

    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (erro) {
    next(erro);
  }
}

// POST /alunos
export async function criarAluno(req, res, next) {
  try {
    const { nome, email, senhaHash, cidade, frase, planosFuturos } = req.body;

    const alunoCriado = await prisma.aluno.create({
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos,
      },
      select: selectSemSenha,
    });

    return res.status(201).json(alunoCriado);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }
    next(error);
  }
}

// PUT /alunos/:id
export async function atualizarAluno(req, res, next) {
  const { id } = req.params;
  const { nome, email, senhaHash, cidade, frase, planosFuturos } = req.body;

  try {
    const alunoAtualizado = await prisma.aluno.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos,
      },
      select: selectSemSenha,
    });

    res.json(alunoAtualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }
    next(error);
  }
}

// DELETE /alunos/:id
export async function deletarAluno(req, res, next) {
  const { id } = req.params;
  try {
    await prisma.aluno.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    next(error);
  }
}