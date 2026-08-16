export const MODES = [
  { id: 'trading', label: 'Trading Geral', sub: 'Fundamentos & análise técnica', count: 25, color: 'var(--blue)', icon: '📈' },
  { id: 'cripto', label: 'Criptomoedas', sub: 'BTC, ETH, DeFi, NFTs', count: 20, color: 'var(--purple)', icon: '₿' },
  { id: 'binarias', label: 'Opções Binárias', sub: 'Call, Put, estratégias', count: 20, color: 'var(--pink)', icon: '⚡' },
  { id: 'forex', label: 'Forex', sub: 'Pares, pips, sessões', count: 20, color: 'var(--blue)', icon: '💱' },
  { id: 'commodities', label: 'Commodities', sub: 'Ouro, petróleo, metais', count: 20, color: 'var(--amber)', icon: '🛢️' },
  { id: 'acoes', label: 'Ações', sub: 'Bolsa, dividendos, P/E', count: 20, color: 'var(--green)', icon: '🏦' },
  { id: 'mercado', label: 'Mercado Financeiro', sub: 'Macro, BODIVA, Fed', count: 20, color: 'var(--purple)', icon: '🌐' },
  { id: 'quotex', label: 'Quotex', sub: 'Conta, depósito, saque', count: 20, color: 'var(--quotex)', icon: 'Q' },
  { id: 'deriv', label: 'Deriv', sub: 'MT5, sintéticos, DBot', count: 20, color: 'var(--deriv)', icon: 'D' },
  { id: 'binance', label: 'Binance', sub: 'Spot, P2P, futuros', count: 20, color: 'var(--binance)', icon: '🔶' }
];

export const COURSES = [
  {
    id: 'introducao-ao-forex',
    title: 'Introdução ao Mercado Forex',
    description: 'Aprende as bases do mercado cambial: pares de moedas, pips, spreads, alavancagem e gestão de risco.',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    category: 'forex',
    level: 'iniciante',
    published: true,
    instructor: 'Equipa TradingAO',
    totalLessons: 3
  },
  {
    id: 'segredos-do-bitcoin',
    title: 'Segredos do Bitcoin & Criptomoedas',
    description: 'Desvenda a blockchain, cria uma carteira segura e aprende a operar na Binance passo a passo.',
    thumbnail: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=600&q=80',
    category: 'cripto',
    level: 'iniciante',
    published: true,
    instructor: 'Trader Angola',
    totalLessons: 2
  },
  {
    id: 'opcoes-binarias-quotex',
    title: 'Dominando Opções Binárias na Quotex',
    description: 'Guia prático focado nas melhores estratégias de curto prazo para operar em opções binárias.',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    category: 'quotex',
    level: 'médio',
    published: true,
    instructor: 'Master Trader Angola',
    totalLessons: 2
  }
];

export const LESSONS = [
  {
    id: 'lesson-forex-1',
    courseId: 'introducao-ao-forex',
    module: 'Módulo 1: Conceitos Básicos',
    title: 'O que é Forex e quem opera nele?',
    description: 'Descobre a dinâmica do mercado financeiro mais líquido do planeta.',
    contentType: 'video',
    content: 'Forex é um mercado descentralizado onde se compram e vendem moedas globais de forma simultânea.',
    videoUrl: 'https://www.tiktok.com/@tsururu_tradring/video/7628558088097811720',
    order: 1
  },
  {
    id: 'lesson-forex-2',
    courseId: 'introducao-ao-forex',
    module: 'Módulo 1: Conceitos Básicos',
    title: 'O que é um Pip e como calcular?',
    description: 'Domina a unidade de medida padrão para oscilações de preço no Forex.',
    contentType: 'mixed',
    content: 'Um pip é a quarta casa decimal em pares como EUR/USD e representa a menor variação de preço.',
    order: 2
  },
  {
    id: 'lesson-forex-3',
    courseId: 'introducao-ao-forex',
    module: 'Módulo 2: Operação na Prática',
    title: 'Alavancagem e Margem: Riscos e Oportunidades',
    description: 'Entende o poder de multiplicar o teu poder de compra e a necessidade de gerir risco.',
    contentType: 'text',
    content: 'A alavancagem aumenta lucros e perdas, por isso usa sempre stop-loss e gestão de risco adequada.',
    order: 3
  },
  {
    id: 'lesson-crypto-1',
    courseId: 'segredos-do-bitcoin',
    module: 'Módulo 1: O Futuro do Dinheiro',
    title: 'O que é Blockchain e o Bitcoin?',
    description: 'Desmistifica a tecnologia por trás das finanças descentralizadas.',
    contentType: 'video',
    content: 'Bitcoin é a primeira criptomoeda descentralizada do mundo, criada em 2009 por Satoshi Nakamoto.',
    videoUrl: 'https://www.tiktok.com/@tsururu_tradring/video/7628558088097811720',
    order: 1
  },
  {
    id: 'lesson-crypto-2',
    courseId: 'segredos-do-bitcoin',
    module: 'Módulo 1: O Futuro do Dinheiro',
    title: 'Como criar conta na Binance e Comprar Cripto',
    description: 'Aprende a criar conta e fazer a primeira compra de cripto de forma segura.',
    contentType: 'video',
    content: 'A Binance é a maior corretora de criptomoedas do mundo em volume de negociação e segurança de fundos.',
    videoUrl: 'https://www.tiktok.com/@tsururu_tradring/video/7628558088097811720',
    order: 2
  }
];

export const QUIZZES = [
  {
    id: 'quiz-forex-iniciante',
    courseId: 'introducao-ao-forex',
    title: 'Quiz de Forex Iniciante',
    description: 'Avalia a tua compreensão sobre pips e pares de moedas.',
    category: 'forex',
    difficulty: 'facil',
    timeLimit: 120
  },
  {
    id: 'quiz-cripto-basico',
    courseId: 'segredos-do-bitcoin',
    title: 'Quiz de Cripto Básico',
    description: 'Testa os teus conhecimentos sobre Bitcoin e blockchain.',
    category: 'cripto',
    difficulty: 'facil',
    timeLimit: 120
  }
];

export const QUESTIONS = [
  {
    id: 'q-forex-1',
    quizId: 'quiz-forex-iniciante',
    questionText: 'Qual é o maior mercado financeiro do mundo em volume diário de negociação?',
    options: ['Bolsa de Valores de Nova Iorque (NYSE)', 'Mercado de Câmbio (Forex)', 'Mercado de Criptomoedas', 'Mercado de Commodities'],
    correctOptionIndex: 1,
    explanation: 'O Forex é o maior mercado financeiro do mundo, transacionando mais de 6 triliões de dólares diariamente.',
    order: 1
  },
  {
    id: 'q-forex-2',
    quizId: 'quiz-forex-iniciante',
    questionText: 'No par GBP/USD, qual moneda é a Moeda Base?',
    options: ['GBP', 'USD', 'Ambas', 'Nenhuma'],
    correctOptionIndex: 0,
    explanation: 'A primeira moeda do par é sempre a Moeda Base.',
    order: 2
  },
  {
    id: 'q-forex-3',
    quizId: 'quiz-forex-iniciante',
    questionText: 'Se EUR/USD sobe de 1.0920 para 1.0925, quantos pips são?',
    options: ['0.5 pips', '50 pips', '5 pips', '0.05 pips'],
    correctOptionIndex: 2,
    explanation: 'A diferença é 0.0005, ou seja, 5 pips.',
    order: 3
  },
  {
    id: 'q-crypto-1',
    quizId: 'quiz-cripto-basico',
    questionText: 'Quem é o criador anónimo do Bitcoin?',
    options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Elon Musk', 'Changpeng Zhao'],
    correctOptionIndex: 1,
    explanation: 'Satoshi Nakamoto é o pseudónimo usado por quem criou o Bitcoin.',
    order: 1
  },
  {
    id: 'q-crypto-2',
    quizId: 'quiz-cripto-basico',
    questionText: 'Qual é o limite máximo de Bitcoins que existirão?',
    options: ['Sem limite', '100 milhões', '21 milhões', '1 bilião'],
    correctOptionIndex: 2,
    explanation: 'O protocolo prevê um teto rígido de 21 milhões de BTC.',
    order: 2
  },
  {
    id: 'q-crypto-3',
    quizId: 'quiz-cripto-basico',
    questionText: 'O que deves guardar com segurança para não perder acesso às tuas criptos?',
    options: ['Email', 'Chaves privadas / seed phrase', 'Link da corretora', 'Foto do BI'],
    correctOptionIndex: 1,
    explanation: 'As chaves privadas ou frase de recuperação são essenciais para controlar os fundos.',
    order: 3
  }
];

export const NEWS = [
  { id: 'news-fed-2026', title: 'Fed mantém taxas estáveis', summary: 'O Fed decidiu manter as taxas de juros e o dólar reagiu com leve alta.', category: 'Macro', date: '2026-05-21' },
  { id: 'news-btc-halving', title: 'Bitcoin sobe após halving', summary: 'O preço do Bitcoin subiu após a última diminuição na recompensa de bloco.', category: 'Cripto', date: '2026-05-20' },
  { id: 'news-bodiva-2026', title: 'BODIVA regista crescimento histórico', summary: 'A bolsa angolana atingiu novo recorde de volume de negociações.', category: 'BODIVA', date: '2026-05-19' }
];

export const BROKERS = [
  { id: 'quotex', title: 'Quotex', href: 'https://broker-qx.pro/sign-up/?lid=2076062', label: 'Abrir conta Quotex', color: 'var(--green)' },
  { id: 'deriv', title: 'Deriv', href: 'https://track.deriv.com/_V1mBADAUk6W4zHaZIQMoUGNd7ZgqdRLk/1/', label: 'Abrir conta Deriv', color: 'var(--red)' },
  { id: 'binance', title: 'Binance', href: 'https://www.binance.com/register?ref=1234866263', label: 'Abrir conta Binance', color: 'var(--amber)' }
];

export const VIDEOS = [
  { id: 'v1', category: 'todos', title: 'Introdução ao Trading em Angola', provider: 'TradingAO', url: 'https://www.tiktok.com/@TradingAOao', thumbnail: '', tag: 'Geral' },
  { id: 'v2', category: 'binance', title: 'Como usar o P2P da Binance', provider: 'Binance Angola', url: 'https://www.tiktok.com/@TradingAOao', thumbnail: '', tag: 'Binance' },
  { id: 'v3', category: 'quotex', title: 'Operando Opções na Quotex', provider: 'Quotex Academy', url: 'https://www.tiktok.com/@TradingAOao', thumbnail: '', tag: 'Quotex' },
  { id: 'v4', category: 'deriv', title: 'Índices Sintéticos na Deriv', provider: 'Deriv Africa', url: 'https://www.tiktok.com/@TradingAOao', thumbnail: '', tag: 'Deriv' },
  { id: 'v5', category: 'trading', title: 'Gestão de risco para traders', provider: 'TradingAO', url: 'https://www.tiktok.com/@TradingAOao', thumbnail: '', tag: 'Trading' }
];

export const RANKING = [
  { id: 'r1', username: 'Nzinga', mode: 'Forex', score: 2820 },
  { id: 'r2', username: 'Mbanza', mode: 'Cripto', score: 2690 },
  { id: 'r3', username: 'Simão', mode: 'Quotex', score: 2530 },
  { id: 'r4', username: 'Carla', mode: 'Trading', score: 2410 },
  { id: 'r5', username: 'Teta', mode: 'Binance', score: 2330 }
];

export const MARKET_INDICES = [
  { id: 'sp500', name: 'S&P 500', value: '4,795.12', change: '+0.42%', type: 'Índice', color: 'var(--green)' },
  { id: 'gold', name: 'Ouro', value: '2,146.70', change: '-0.18%', type: 'Commodity', color: 'var(--amber)' },
  { id: 'btc', name: 'Bitcoin', value: '68,230', change: '+1.14%', type: 'Cripto', color: 'var(--purple)' },
  { id: 'dxy', name: 'Dólar (DXY)', value: '103.12', change: '+0.08%', type: 'Forex', color: 'var(--blue)' }
];

export const MARKET_NEWS = [
  { id: 'm1', title: 'Mercados respiram após decisão do Fed', summary: 'A bolsa americana fecha em leve alta depois de sinais de estabilização inflacionária.', category: 'Macro', date: '2026-04-12' },
  { id: 'm2', title: 'Binance amplia suporte P2P em Angola', summary: 'Nova integração com MultiBanco permite depósitos mais rápidos para traders angolanos.', category: 'Cripto', date: '2026-04-10' },
  { id: 'm3', title: 'BODIVA ajusta taxas para 2026', summary: 'Mudanças na taxa de referência trazem volatilidade extra ao mercado local.', category: 'BODIVA', date: '2026-04-08' }
];

export const INSTRUCTORS = [
  { id: 'rodolfo-santos', name: 'Rodolfo Santos', role: 'Trader Senior', website: 'https://tradingao.com/rodolfo', verificationStatus: 'RETAIL_VERIFIED' },
  { id: 'maria-rosa', name: 'Maria Rosa', role: 'Analista de Cripto', website: 'https://tradingao.com/maria', verificationStatus: 'ADMIN_APPROVED' }
];

export const LIVE_ROOMS = [
  { roomId: 'forex-ao-vivo-1', title: 'Sala Forex Ao Vivo', instructorId: 'rodolfo-santos', startTime: '2026-05-18T19:00', endTime: '2026-05-18T20:30', isLive: false },
  { roomId: 'criptos-ao-vivo', title: 'Cripto Trading Live', instructorId: 'maria-rosa', startTime: '2026-05-20T18:00', endTime: '2026-05-20T19:30', isLive: true }
];
