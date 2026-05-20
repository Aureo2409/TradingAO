/**
 * TradingAO - Script de Semente (Seed Database)
 * Este script inicializa a base de dados do Firestore com os cursos,
 * aulas, quizzes e perguntas de exemplo para a plataforma educativa.
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, collection, addDoc, getDocs, deleteDoc, query } = require("firebase/firestore");

// Configurações do Firebase do projeto TradingAO
const firebaseConfig = {
  apiKey: "AIzaSyCggKoiEffAWpvk62K1XRS3x6QnCVSgfEs",
  authDomain: "tradingao-928e6.firebaseapp.com",
  projectId: "tradingao-928e6",
  storageBucket: "tradingao-928e6.firebasestorage.app",
  messagingSenderId: "540884721819",
  appId: "1:540884721819:web:bcc0a42d5a4ca3e563263e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DADOS DE EXEMPLO PARA SEMEAR
const COURSES = [
  {
    id: "introducao-ao-forex",
    title: "Introdução ao Mercado Forex",
    description: "Aprende as bases do mercado cambial (Forex). Entende o que são pares de moedas, como funcionam as cotações, o que são pips, spreads, alavancagem e como fazer a tua primeira operação com segurança.",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    category: "forex",
    level: "iniciante",
    published: true,
    instructor: "Equipa TradingAO",
    totalLessons: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "segredos-do-bitcoin",
    title: "Segredos do Bitcoin & Criptomoedas",
    description: "Desvenda o mundo das criptomoedas. Entende a tecnologia Blockchain, aprende a criar a tua carteira digital, como transferir ativos de forma segura e como operar na Binance do zero.",
    thumbnail: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=600&q=80",
    category: "cripto",
    level: "iniciante",
    published: true,
    instructor: "Instrutor TradingAO",
    totalLessons: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "opcoes-binarias-quotex",
    title: "Dominando Opções Binárias na Quotex",
    description: "Um guia prático focado na corretora Quotex. Aprende a analisar tendências de curtíssimo prazo, gerir o teu capital com técnicas avançadas e utilizar indicadores como suporte/resistência e RSI.",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    category: "quotex",
    level: "medio",
    published: true,
    instructor: "Master Trader Angola",
    totalLessons: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const LESSONS = [
  // Aulas: Introdução ao Forex
  {
    courseId: "introducao-ao-forex",
    module: "Módulo 1: Conceitos Básicos",
    title: "O que é Forex e quem opera nele?",
    description: "Descobre a dinâmica do mercado financeiro mais líquido do planeta, movimentando mais de 6 triliões de dólares diários.",
    contentType: "video",
    content: `<h3>O que é o Mercado Forex?</h3>
<p>Forex é o acrónimo de <strong>Foreign Exchange</strong> (Mercado de Câmbio). É um mercado descentralizado onde se compram e vendem moedas globais de forma simultânea. Quando operas Forex, estás sempre a negociar um <strong>par de moedas</strong> (por exemplo, EUR/USD).</p>

<h3>Os Participantes do Mercado</h3>
<p>O mercado é composto por grandes instituições financeiras, bancos centrais, governos, multinacionais, fundos de investimento e, finalmente, <strong>traders de retalho</strong> (nós, pequenos especuladores privados).</p>

<h3>Como Funciona um Par de Moedas?</h3>
<p>No par <strong>EUR/USD</strong>:</p>
<ul>
  <li><strong>EUR (Euro)</strong> é a moeda base.</li>
  <li><strong>USD (Dólar Americano)</strong> é a moeda de cotação.</li>
</ul>
<p>Se a cotação do EUR/USD for 1.0850, isso significa que 1 Euro equivale a exatamente 1.0850 Dólares Americanos.</p>`,
    videoUrl: "https://www.tiktok.com/@tsururu_tradring/video/7628558088097811720",
    videoDuration: 180,
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    courseId: "introducao-ao-forex",
    module: "Módulo 1: Conceitos Básicos",
    title: "O que é um Pip e como calcular?",
    description: "Domina a unidade de medida padrão para oscilações de preço no Forex e calcula os teus lucros com precisão.",
    contentType: "mixed",
    content: `<h3>O que é um Pip?</h3>
<p><strong>PIP</strong> significa <em>Percentage in Point</em> (ou Price Interest Point). É a unidade que mede a variação de preço de um par de moedas. Na maioria dos pares (como EUR/USD, GBP/USD), o pip é a <strong>quarta casa decimal</strong> (0.0001).</p>

<p><strong>Exemplo:</strong> Se o EUR/USD subir de 1.0850 para 1.0851, subiu <strong>1 Pip</strong>.</p>

<h3>A Exceção: Pares com Iene Japonês (JPY)</h3>
<p>Nos pares com JPY (como USD/JPY), o pip é a <strong>segunda casa decimal</strong> (0.01).</p>
<p><strong>Exemplo:</strong> Se o USD/JPY mover de 150.20 para 150.25, moveu <strong>5 Pips</strong>.</p>

<h3>Como calcular o valor de 1 Pip?</h3>
<p>O valor do pip depende do <strong>tamanho do lote</strong> que estás a operar:</p>
<ul>
  <li><strong>Lote Padrão (1.0)</strong> = 100.000 unidades da moeda base. O pip vale aprox. <strong>$10 USD</strong>.</li>
  <li><strong>Mini Lote (0.10)</strong> = 10.000 unidades. O pip vale aprox. <strong>$1 USD</strong>.</li>
  <li><strong>Micro Lote (0.01)</strong> = 1.000 unidades. O pip vale aprox. <strong>$0.10 USD</strong>.</li>
</ul>`,
    videoUrl: "",
    videoDuration: 0,
    order: 2,
    createdAt: new Date().toISOString()
  },
  {
    courseId: "introducao-ao-forex",
    module: "Módulo 2: Operação na Prática",
    title: "Alavancagem e Margem: Riscos e Oportunidades",
    description: "Entende o poder de multiplicar o teu poder de compra e aprende a proteger o teu saldo contra perdas excessivas.",
    contentType: "text",
    content: `<h3>O que é Alavancagem no Trading?</h3>
<p>A alavancagem permite-te controlar posições financeiras de grande valor utilizando apenas uma pequena fração do teu próprio capital como garantia. Funciona como um multiplicador fornecido pela tua corretora.</p>

<p>Por exemplo, com uma alavancagem de <strong>1:100</strong>, podes negociar posições de $10.000 USD tendo apenas $100 USD na tua conta.</p>

<h3>O Conceito de Margem</h3>
<p>A <strong>Margem</strong> é o valor de garantia que a corretora bloqueia no teu saldo para manter a tua operação aberta. Se a operação for contra ti e o teu saldo livre chegar a zero, a corretora executa o <em>Margin Call</em> ou o <em>Stop Out</em>, fechando automaticamente as tuas posições para evitar saldo negativo.</p>

<h3>O Perigo da Super-Alavancagem</h3>
<p>Embora a alavancagem multiplique os teus lucros potenciais, ela também **multiplica as tuas perdas na mesma proporção**. Gerir o risco usando ordens de <strong>Stop Loss (Limitar Perdas)</strong> é essencial para sobreviver no mercado.</p>`,
    videoUrl: "",
    videoDuration: 0,
    order: 3,
    createdAt: new Date().toISOString()
  },

  // Aulas: Segredos do Bitcoin
  {
    courseId: "segredos-do-bitcoin",
    module: "Módulo 1: O Futuro do Dinheiro",
    title: "O que é Blockchain e o Bitcoin?",
    description: "Desmistifica a tecnologia por trás das finanças descentralizadas e entende por que o Bitcoin é considerado ouro digital.",
    contentType: "video",
    content: `<h3>O que é o Bitcoin?</h3>
<p>O Bitcoin (BTC) é a primeira criptomoeda descentralizada do mundo, criada em 2009 por um autor anónimo sob o pseudónimo de <strong>Satoshi Nakamoto</strong>. É um dinheiro digital peer-to-peer (de pessoa para pessoa), livre de controle de bancos centrais ou governos.</p>

<h3>Como funciona a Blockchain?</h3>
<p>A <strong>Blockchain</strong> (Cadeia de Blocos) é uma tecnologia de registro distribuído (ledger). Funciona como um livro de contabilidade digital público, imutável e descentralizado, onde todas as transações são verificadas por milhares de computadores (mineradores) espalhados pelo mundo.</p>

<h3>Características Principais do Bitcoin:</h3>
<ul>
  <li><strong>Escassez Digital:</strong> Apenas existirão 21 milhões de moedas de Bitcoin criadas na história.</li>
  <li><strong>Segurança:</strong> Protegido por criptografia avançada de chaves públicas e privadas.</li>
  <li><strong>Resistência à Censura:</strong> Nenhuma entidade pode bloquear ou reverter uma transferência válida de Bitcoin.</li>
</ul>`,
    videoUrl: "https://www.tiktok.com/@tsururu_tradring/video/7628558088097811720",
    videoDuration: 220,
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    courseId: "segredos-do-bitcoin",
    module: "Módulo 1: O Futuro do Dinheiro",
    title: "Como criar conta na Binance e Comprar Cripto",
    description: "Aprende passo a passo como registrar-te de forma segura na maior corretora do mundo e efetuar a tua primeira compra.",
    contentType: "video",
    content: `<h3>Porquê a Binance?</h3>
<p>A Binance é a maior corretora de criptomoedas do mundo em volume de negociação e segurança de fundos (SAFU). Permite comprar, vender, fazer trading e armazenar centenas de ativos digitais.</p>

<h3>Passo a Passo para Começar:</h3>
<ol>
  <li><strong>Registro de Conta:</strong> Acede ao site ou app oficial da Binance e cria a tua conta usando o teu email ou telemóvel.</li>
  <li><strong>Verificação de Identidade (KYC):</strong> Envia fotos de um documento oficial (BI ou Passaporte) para desbloquear transações e proteger a tua conta de fraudes.</li>
  <li><strong>Configurar Segurança (2FA):</strong> Ativa a autenticação de dois fatores (Google Authenticator ou SMS) para impedir acessos não autorizados.</li>
  <li><strong>Comprar Cripto:</strong> Acede ao painel e compra criptomoedas através de métodos locais, como transferência bancária, P2P (Peer-to-Peer) ou cartão.</li>
</ol>`,
    videoUrl: "https://www.tiktok.com/@tsururu_tradring/video/7628558088097811720",
    videoDuration: 300,
    order: 2,
    createdAt: new Date().toISOString()
  }
];

const QUIZZES = [
  {
    id: "quiz-forex-iniciante",
    courseId: "introducao-ao-forex",
    title: "Quiz de Forex Iniciante",
    description: "Avalia a tua compreensão sobre pips, pares de moedas, alavancagem e funcionamento geral do mercado Forex.",
    category: "forex",
    difficulty: "facil",
    timeLimit: 120,
    createdAt: new Date().toISOString()
  },
  {
    id: "quiz-cripto-basico",
    courseId: "segredos-do-bitcoin",
    title: "Quiz de Cripto Básico",
    description: "Testa os teus conhecimentos sobre Bitcoin, Blockchain, chaves privadas e boas práticas na Binance.",
    category: "cripto",
    difficulty: "facil",
    timeLimit: 120,
    createdAt: new Date().toISOString()
  }
];

const QUESTIONS = [
  // Perguntas do Quiz de Forex Iniciante
  {
    quizId: "quiz-forex-iniciante",
    questionText: "Qual é o maior mercado financeiro do mundo em volume diário de negociação?",
    options: [
      "Bolsa de Valores de Nova Iorque (NYSE)",
      "Mercado de Câmbio (Forex)",
      "Mercado de Criptomoedas",
      "Mercado de Commodities"
    ],
    correctOptionIndex: 1,
    explanation: "O Forex é, de longe, o maior mercado financeiro do mundo, transacionando mais de 6 triliões de dólares diariamente, muito acima de qualquer bolsa de ações.",
    order: 1
  },
  {
    quizId: "quiz-forex-iniciante",
    questionText: "No par de moedas GBP/USD, qual delas representa a Moeda Base?",
    options: [
      "GBP (Libra Esterlina)",
      "USD (Dólar Americano)",
      "Ambas são consideradas moedas base",
      "Nenhuma das duas"
    ],
    correctOptionIndex: 0,
    explanation: "Em qualquer par de moedas Forex, a primeira moeda listada à esquerda é a Moeda Base, enquanto a segunda é a Moeda de Cotação.",
    order: 2
  },
  {
    quizId: "quiz-forex-iniciante",
    questionText: "Se o par EUR/USD passar de 1.0920 para 1.0925, quantos pips subiu o preço?",
    options: [
      "0.5 pips",
      "50 pips",
      "5 pips",
      "0.05 pips"
    ],
    correctOptionIndex: 2,
    explanation: "Para a maioria dos pares, 1 pip é a quarta casa decimal (0.0001). A diferença entre 1.0920 e 1.0925 é 0.0005, o que equivale a exatamente 5 pips.",
    order: 3
  },
  {
    quizId: "quiz-forex-iniciante",
    questionText: "Qual é o principal risco associado à super-alavancagem no trading?",
    options: [
      "Limitação de lucros pela corretora",
      "Perda rápida do saldo da conta (Stop Out)",
      "Redução automática da velocidade de execução",
      "Impossibilidade de abrir operações de compra"
    ],
    correctOptionIndex: 1,
    explanation: "A alavancagem aumenta tanto os ganhos quanto as perdas potenciais. Usar alavancagem exagerada sem stop-loss pode queimar todo o saldo disponível de margem em poucos minutos.",
    order: 4
  },

  // Perguntas do Quiz de Cripto Básico
  {
    quizId: "quiz-cripto-basico",
    questionText: "Quem é reconhecido como o criador anónimo do Bitcoin?",
    options: [
      "Vitalik Buterin",
      "Satoshi Nakamoto",
      "Elon Musk",
      "Changpeng Zhao (CZ)"
    ],
    correctOptionIndex: 1,
    explanation: "Satoshi Nakamoto é o pseudónimo utilizado pela pessoa ou grupo de pessoas que publicou o whitepaper do Bitcoin em 2008 e lançou o software original em 2009.",
    order: 1
  },
  {
    quizId: "quiz-cripto-basico",
    questionText: "Qual é o limite máximo estipulado de moedas de Bitcoin que alguma vez existirão?",
    options: [
      "Sem limite (emissão contínua)",
      "100 milhões",
      "21 milhões",
      "1 bilião"
    ],
    correctOptionIndex: 2,
    explanation: "A escassez matemática é um dos principais pilares do Bitcoin. O código do protocolo prevê um teto rígido de exatamente 21 milhões de BTCs, tornando-o deflacionário.",
    order: 2
  },
  {
    quizId: "quiz-cripto-basico",
    questionText: "O que deves guardar com segurança absoluta para evitar perder o acesso às tuas criptomoedas numa carteira não-custodial?",
    options: [
      "O teu endereço de email principal",
      "As tuas chaves privadas ou Frase de Recuperação (Seed Phrase)",
      "O link do site da corretora",
      "A foto do teu BI ou Passaporte"
    ],
    correctOptionIndex: 1,
    explanation: "No mundo cripto, vigora a regra 'not your keys, not your coins'. A chave privada/frase de semente (seed phrase) é o único meio de provar propriedade e movimentar fundos. Quem tiver a chave tem controlo total dos fundos.",
    order: 3
  }
];

// FUNÇÃO DE EXECUÇÃO DO SEED
async function seedDatabase() {
  console.log("🚀 A iniciar a sementeira do banco de dados TradingAO...");

  try {
    // 1. Semear Cursos
    console.log("\n📦 Semeando Cursos...");
    for (const course of COURSES) {
      await setDoc(doc(db, "courses", course.id), course);
      console.log(`✅ Curso adicionado/atualizado: ${course.title}`);
    }

    // 2. Limpar e Semear Aulas (lessons)
    console.log("\n📖 Semeando Aulas...");
    // Para simplificar, apagamos as existentes primeiro ou apenas inserimos com IDs fixos
    // Vamos adicionar diretamente como novos documentos na coleção
    const lessonsSnapshot = await getDocs(collection(db, "lessons"));
    for (const docItem of lessonsSnapshot.docs) {
      await deleteDoc(docItem.ref);
    }
    console.log("🧹 Coleção de aulas limpa.");

    for (const lesson of LESSONS) {
      const docRef = await addDoc(collection(db, "lessons"), lesson);
      console.log(`✅ Aula adicionada [ID: ${docRef.id}]: ${lesson.title}`);
    }

    // 3. Semear Quizzes
    console.log("\n🏆 Semeando Quizzes...");
    for (const quiz of QUIZZES) {
      await setDoc(doc(db, "quizzes", quiz.id), quiz);
      console.log(`✅ Quiz adicionado/atualizado: ${quiz.title}`);
    }

    // 4. Limpar e Semear Perguntas (questions)
    console.log("\n❓ Semeando Perguntas...");
    const questionsSnapshot = await getDocs(collection(db, "questions"));
    for (const docItem of questionsSnapshot.docs) {
      await deleteDoc(docItem.ref);
    }
    console.log("🧹 Coleção de perguntas limpa.");

    for (const question of QUESTIONS) {
      const docRef = await addDoc(collection(db, "questions"), question);
      console.log(`✅ Pergunta adicionada [ID: ${docRef.id}]: ${question.questionText.substring(0, 30)}...`);
    }

    console.log("\n🌟 Sementeira concluída com sucesso absoluta! Base de dados construída.");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Erro crítico ao semear o banco de dados:", error);
    process.exit(1);
  }
}

// Executar
seedDatabase();
