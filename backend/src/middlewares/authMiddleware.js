const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      sucesso: false, 
      mensagem: 'Acesso negado. Token não fornecido.' 
    });
  }

  // Divide o header para separar o "Bearer" do token em si
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      sucesso: false, 
      mensagem: 'Acesso negado. Token não fornecido.' 
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Adiciona os dados decodificados (id, tipo) à requisição
    next();
  } catch (error) {
    return res.status(401).json({ 
      sucesso: false, 
      mensagem: 'Token inválido ou expirado.' 
    });
  }
};

const verificarFuncionario = (req, res, next) => {
  if (!req.usuario || req.usuario.tipo !== 'funcionario') {
    return res.status(403).json({ 
      sucesso: false, 
      mensagem: 'Acesso restrito. Requer privilégios de funcionário.' 
    });
  }
  
  next();
};

module.exports = {
  verificarToken,
  verificarFuncionario
};
