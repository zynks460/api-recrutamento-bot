const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    status: '✅ API Online',
    mensagem: 'API de Recrutamento funcionando!',
    versao: '1.0.0',
    endpoints: {
      certificado: 'POST /api/certificado',
      teste: 'GET /api/teste'
    }
  });
});

// Rota de teste simples
app.get('/api/teste', (req, res) => {
  res.json({ 
    teste: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Rota principal - gerar certificado
app.post('/api/certificado', (req, res) => {
  try {
    const { nome, recrutado, identidade, nick } = req.body;
    
    // Validação
    if (!nome || !recrutado) {
      return res.status(400).json({ 
        sucesso: false,
        erro: 'Campos obrigatórios: nome e recrutado'
      });
    }
    
    // Gera dados do certificado
    const numeroCertificado = `CERT-${Date.now().toString().slice(-6)}`;
    const numeroRecrutamento = Math.floor(Math.random() * 9000) + 1000;
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
    
    // Resposta
    const certificado = {
      sucesso: true,
      certificado: {
        numero: numeroCertificado,
        categoria: 'RECRUTAMENTO',
        nomeRazaoSocial: nome,
        recrutado: recrutado,
        numeroRecrutamento: numeroRecrutamento,
        identidade: identidade || 'Não informado',
        nickRoblox: nick || 'Não informado',
        dataEmissao: timestamp
      }
    };
    
    console.log(`[${timestamp}] Certificado gerado: ${numeroCertificado}`);
    
    res.json(certificado);
    
  } catch (erro) {
    console.error('Erro:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro interno do servidor'
    });
  }
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API rodando na porta ${PORT}`);
});

module.exports = app;
