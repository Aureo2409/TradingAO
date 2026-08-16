import { useEffect, useMemo, useState } from 'react';
import './styles.css';
import { FirebaseBridge } from './firebase';
import { Store } from './store';
import {
  BROKERS,
  COURSES,
  INSTRUCTORS,
  LESSONS,
  LIVE_ROOMS,
  MARKET_INDICES,
  MARKET_NEWS,
  MODES,
  NEWS,
  QUESTIONS,
  QUIZZES,
  RANKING,
  VIDEOS
} from './data';

const TABS = [
  { id: 'quiz', label: 'Quiz' },
  { id: 'courses', label: 'Academia' },
  { id: 'videos', label: 'Vídeos' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'mercado', label: 'Mercado' },
  { id: 'admin', label: 'Admin' }
];

const INITIAL_QUIZ_STATE = {
  active: false,
  mode: null,
  modeLabel: '',
  questions: [],
  currentIndex: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  answered: false,
  selectedOption: null,
  resultVisible: false,
  resultPct: 0
};

const ADMIN_TABS = [
  { id: 'courses', label: 'Cursos' },
  { id: 'lessons', label: 'Aulas' },
  { id: 'quizzes', label: 'Quizzes' },
  { id: 'questions', label: 'Perguntas' },
  { id: 'instructors', label: 'Instrutores' },
  { id: 'live_rooms', label: 'Salas Ao Vivo' }
];

function App() {
  const [activeTab, setActiveTab] = useState('quiz');
  const [videoFilter, setVideoFilter] = useState('todos');
  const [rankFilter, setRankFilter] = useState('todos');
  const [marketTab, setMarketTab] = useState('quotes');
  const [adminTab, setAdminTab] = useState('courses');
  const [courses, setCourses] = useState(COURSES);
  const [instructors, setInstructors] = useState(INSTRUCTORS);
  const [liveRooms, setLiveRooms] = useState(LIVE_ROOMS);
  const [news, setNews] = useState(MARKET_NEWS);
  const [questions, setQuestions] = useState(QUESTIONS);
  const [quizzes, setQuizzes] = useState(QUIZZES);
  const [lessons, setLessons] = useState(LESSONS);
  const [scores, setScores] = useState(RANKING);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [courseProgress, setCourseProgress] = useState({ completedLessons: [] });
  const [courseProgressMap, setCourseProgressMap] = useState({});
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [adminFormVisible, setAdminFormVisible] = useState(false);
  const [adminFormMode, setAdminFormMode] = useState('create');
  const [adminFormType, setAdminFormType] = useState('courses');
  const [adminFormData, setAdminFormData] = useState({});
  const [quizState, setQuizState] = useState(INITIAL_QUIZ_STATE);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initData = async () => {
      await Store.init();
      const [remoteCourses, remoteInstructors, remoteLiveRooms, remoteNews, remoteQuizzes, remoteQuestions, remoteLessons, remoteScores] = await Promise.all([
        Store.courses(),
        Store.instructors(),
        Store.liveRooms(),
        Store.news(),
        Store.quizzes(),
        Store.questions(),
        Store.lessons(),
        Store.scores()
      ]);

      setCourses(remoteCourses.length ? remoteCourses : COURSES);
      setInstructors(remoteInstructors.length ? remoteInstructors : INSTRUCTORS);
      setLiveRooms(remoteLiveRooms.length ? remoteLiveRooms : LIVE_ROOMS);
      setNews(remoteNews.length ? remoteNews : MARKET_NEWS);
      setQuizzes(remoteQuizzes.length ? remoteQuizzes : QUIZZES);
      setQuestions(remoteQuestions.length ? remoteQuestions : QUESTIONS);
      setLessons(remoteLessons.length ? remoteLessons : LESSONS);
      setScores(remoteScores.length ? remoteScores : RANKING);
      await refreshProgressMap(remoteCourses.length ? remoteCourses : COURSES);
      setInitialized(true);
    };
    initData();
  }, []);

  const refreshProgressMap = async (courseList) => {
    const entries = await Promise.all((courseList || courses).map(async (course) => {
      const progress = await Store.getProgress(course.id);
      return [course.id, progress || { completedLessons: [] }];
    }));
    const map = Object.fromEntries(entries);
    setCourseProgressMap(map);
    return map;
  };

  const filteredVideos = useMemo(() => {
    if (videoFilter === 'todos') return VIDEOS;
    return VIDEOS.filter((video) => video.category === videoFilter);
  }, [videoFilter]);

  const filteredRanking = useMemo(() => {
    if (rankFilter === 'todos') return scores;
    return scores.filter((item) => item.mode.toLowerCase() === rankFilter.toLowerCase());
  }, [rankFilter, scores]);

  const courseQuizzes = useMemo(() => {
    if (!selectedCourse) return [];
    return quizzes.filter((quiz) => quiz.courseId === selectedCourse.id);
  }, [selectedCourse, quizzes]);

  const getCourseProgressData = (course) => {
    const completed = courseProgressMap[course.id]?.completedLessons?.length || 0;
    const totalLessons = course.totalLessons || 0;
    const pct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    return { completed, totalLessons, pct };
  };

  const selectedInstructor = selectedCourse
    ? instructors.find(
        (inst) => inst.id === selectedCourse.instructor || inst.name === selectedCourse.instructor || inst.id === selectedCourse.instructorId
      )
    : null;

  const courseLiveRooms = useMemo(() => {
    if (!selectedCourse) return [];
    const instructorName = selectedCourse.instructor?.toLowerCase();
    return liveRooms.filter((room) => {
      const instructor = instructors.find((inst) => inst.id === room.instructorId);
      return (
        (instructor && instructorName && instructor.name.toLowerCase() === instructorName) ||
        room.instructorId === selectedCourse.instructorId ||
        room.instructorId === selectedCourse.instructor
      );
    });
  }, [selectedCourse, liveRooms, instructors]);

  const currentQuiz = quizState.questions[quizState.currentIndex] || null;

  const startQuizMode = async (modeId) => {
    if (modeId === 'diario') {
      const allQuestions = questions;
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 15);
      setQuizState({
        ...INITIAL_QUIZ_STATE,
        active: true,
        mode: 'diario',
        modeLabel: 'Desafio Diário',
        questions: shuffled
      });
      return;
    }

    const mode = MODES.find((item) => item.id === modeId);
    if (!mode) return;

    const selectedQuizzes = quizzes.filter((quiz) => quiz.category === modeId);
    const loadedQuestions = selectedQuizzes.flatMap((quiz) =>
      questions.filter((question) => question.quizId === quiz.id)
    );
    const sourceQuestions = loadedQuestions.length ? loadedQuestions : questions.filter((question) => question.category === modeId);
    const shuffled = [...sourceQuestions].sort(() => Math.random() - 0.5).slice(0, mode.count);

    setQuizState({
      ...INITIAL_QUIZ_STATE,
      active: true,
      mode: modeId,
      modeLabel: mode.label,
      questions: shuffled
    });
  };

  const startCourseQuiz = (quiz) => {
    const loadedQuestions = questions.filter((question) => question.quizId === quiz.id);
    if (!loadedQuestions.length) return;
    setActiveTab('quiz');
    setQuizState({
      ...INITIAL_QUIZ_STATE,
      active: true,
      mode: quiz.category,
      modeLabel: quiz.title,
      questions: loadedQuestions
    });
  };

  const answerQuestion = (index) => {
    if (!currentQuiz || quizState.answered) return;
    const isCorrect = index === currentQuiz.correctOptionIndex;
    const nextState = {
      ...quizState,
      answered: true,
      selectedOption: index,
      score: quizState.score + (isCorrect ? 10 : 0),
      correct: quizState.correct + (isCorrect ? 1 : 0),
      wrong: quizState.wrong + (isCorrect ? 0 : 1)
    };
    setQuizState(nextState);
  };

  const nextQuestion = () => {
    const nextIndex = quizState.currentIndex + 1;
    if (nextIndex >= quizState.questions.length) {
      const pct = quizState.questions.length > 0 ? Math.round((quizState.correct / quizState.questions.length) * 100) : 0;
      setQuizState({
        ...quizState,
        resultVisible: true,
        resultPct: pct
      });
    } else {
      setQuizState({
        ...quizState,
        currentIndex: nextIndex,
        answered: false,
        selectedOption: null
      });
    }
  };

  const restartQuiz = () => {
    setQuizState(INITIAL_QUIZ_STATE);
  };

  const openCourseDetail = async (course) => {
    setSelectedCourse(course);
    const lessonsForCourse = await Store.lessons(course.id);
    setCourseLessons(lessonsForCourse);
    if (lessonsForCourse.length > 0) {
      setActiveLessonId(lessonsForCourse[0].id);
    }
    const progress = await Store.getProgress(course.id);
    setCourseProgress(progress || { completedLessons: [] });
  };

  const closeCourseDetail = () => {
    setSelectedCourse(null);
    setCourseLessons([]);
    setActiveLessonId(null);
  };

  const joinLiveRoom = (room) => {
    const instructor = instructors.find((inst) => inst.id === room.instructorId);
    const targetUrl = room.link || instructor?.website || `https://tradingao.com/live/${room.roomId}`;
    window.open(targetUrl, '_blank');
  };

  const completeLesson = async (lessonId) => {
    if (!selectedCourse) return;
    const completed = new Set(courseProgress.completedLessons || []);
    completed.add(lessonId);
    const next = { completedLessons: Array.from(completed) };
    await Store.saveProgress(selectedCourse.id, next);
    setCourseProgress(next);
    await refreshProgressMap(courses);

    const currentIndex = courseLessons.findIndex((lesson) => lesson.id === lessonId);
    if (currentIndex >= 0 && currentIndex < courseLessons.length - 1) {
      setActiveLessonId(courseLessons[currentIndex + 1].id);
    }
  };

  const selectLesson = (lessonId) => {
    setActiveLessonId(lessonId);
  };

  const openAdminForm = (type, mode = 'create', item = null) => {
    setAdminFormType(type);
    setAdminFormMode(mode);
    setAdminFormVisible(true);
    if (item) {
      setAdminFormData({ ...item });
    } else {
      const empty = {
        courses: { id: '', title: '', description: '', category: '', level: 'iniciante', thumbnail: '', published: true },
        instructors: { id: '', name: '', role: '', website: '', verificationStatus: 'RETAIL_VERIFIED' },
        live_rooms: { roomId: '', title: '', instructorId: instructors[0]?.id || '', startTime: '', endTime: '', isLive: false },
        lessons: { id: '', courseId: courses[0]?.id || '', module: '', title: '', description: '', contentType: 'text', content: '', videoUrl: '', order: 1 },
        quizzes: { id: '', courseId: courses[0]?.id || '', title: '', description: '', category: courses[0]?.category || '', difficulty: 'facil', timeLimit: 120 },
        questions: { id: '', quizId: quizzes[0]?.id || '', questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '', order: 1 }
      };
      setAdminFormData(empty[type] || {});
    }
  };

  const closeAdminForm = () => {
    setAdminFormVisible(false);
    setAdminFormData({});
  };

  const handleAdminFormChange = (field, value) => {
    setAdminFormData((current) => ({ ...current, [field]: value }));
  };

  const saveAdminItem = async () => {
    if (adminFormType === 'courses') {
      const item = { ...adminFormData, published: adminFormData.published === true || adminFormData.published === 'true' };
      await Store.saveCourse(item);
      const updatedCourses = await Store.courses();
      setCourses(updatedCourses);
      await refreshProgressMap(updatedCourses);
    }

    if (adminFormType === 'instructors') {
      await Store.saveInstructor(adminFormData);
      setInstructors(await Store.instructors());
    }

    if (adminFormType === 'live_rooms') {
      await Store.saveLiveRoom(adminFormData);
      setLiveRooms(await Store.liveRooms());
    }

    if (adminFormType === 'lessons') {
      const lesson = {
        ...adminFormData,
        order: Number(adminFormData.order || 1)
      };
      await Store.saveLesson(lesson);
      const allLessons = await Store.lessons();
      setLessons(allLessons);
      if (selectedCourse && lesson.courseId === selectedCourse.id) {
        setCourseLessons(await Store.lessons(selectedCourse.id));
      }
    }

    if (adminFormType === 'quizzes') {
      const quiz = {
        ...adminFormData,
        timeLimit: Number(adminFormData.timeLimit || 120)
      };
      await Store.saveQuiz(quiz);
      setQuizzes(await Store.quizzes());
    }

    if (adminFormType === 'questions') {
      const question = {
        ...adminFormData,
        options: Array.isArray(adminFormData.options)
          ? adminFormData.options
          : String(adminFormData.options).split(',').map((option) => option.trim()),
        correctOptionIndex: Number(adminFormData.correctOptionIndex || 0),
        order: Number(adminFormData.order || 1)
      };
      await Store.saveQuestion(question);
      setQuestions(await Store.questions());
    }

    closeAdminForm();
  };

  const deleteAdminItem = async (id) => {
    if (adminTab === 'courses') {
      await Store.deleteCourse(id);
      const updatedCourses = await Store.courses();
      setCourses(updatedCourses);
      await refreshProgressMap(updatedCourses);
    }
    if (adminTab === 'instructors') {
      await Store.deleteInstructor(id);
      setInstructors(await Store.instructors());
    }
    if (adminTab === 'live_rooms') {
      await Store.deleteLiveRoom(id);
      setLiveRooms(await Store.liveRooms());
    }
    if (adminTab === 'lessons') {
      await Store.deleteLesson(id);
      setLessons(await Store.lessons());
    }
    if (adminTab === 'quizzes') {
      await Store.deleteQuiz(id);
      setQuizzes(await Store.quizzes());
    }
    if (adminTab === 'questions') {
      await Store.deleteQuestion(id);
      setQuestions(await Store.questions());
    }
  };

  const saveInstructor = async (inst) => {
    await Store.saveInstructor(inst);
    const updated = await Store.instructors();
    setInstructors(updated);
  };

  const saveLiveRoom = async (room) => {
    await Store.saveLiveRoom(room);
    const updated = await Store.liveRooms();
    setLiveRooms(updated);
  };

  const saveCourse = async (course) => {
    await Store.saveCourse(course);
    const updated = await Store.courses();
    setCourses(updated);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">
          <span className="logo-t">Trading</span>
          <span className="logo-a">AO</span>
        </div>
        <nav className="main-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`hdr-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'quiz' && (
          <section className="tab-content">
            <div className="hero">
              <h1 className="hero-title">
                <span className="nb">TESTA</span> OS TEUS<br />CONHECIMENTOS<br />
                <span className="ng">DE TRADING</span>
              </h1>
              <p className="hero-sub">10 modos de quiz — clica num modo para começar imediatamente.</p>
            </div>

            <div className="daily-challenge-card">
              <div className="daily-challenge-content">
                <div className="daily-challenge-tag">⚡ Desafio Diário</div>
                <div className="daily-challenge-title">Desafio de Alta Velocidade</div>
                <div className="daily-challenge-desc">15 perguntas misturadas aleatoriamente de todos os mercados. Mantém a sequência de acertos e conquista o pódio.</div>
              </div>
              <div className="daily-challenge-action">
                <button className="btn btn-primary" onClick={() => startQuizMode('diario')}>
                  🚀 JOGAR DESAFIO
                </button>
              </div>
            </div>

            <div className="sl" style={{ textAlign: 'center', marginBottom: 20 }}>Escolhe o teu modo</div>
            <div className="mode-grid" role="list">
              {MODES.map((mode) => (
                <button key={mode.id} className="mode-card" onClick={() => startQuizMode(mode.id)}>
                  <div className="mode-icon" style={{ background: mode.color }}>{mode.icon}</div>
                  <div>
                    <div className="mode-title">{mode.label}</div>
                    <div className="mode-sub">{mode.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {quizState.active && (
              <div className="quiz-panel">
                <div className="quiz-header">
                  <div className="q-badge">{quizState.modeLabel}</div>
                  <div className="q-status">
                    <span>{quizState.currentIndex + 1}/{quizState.questions.length}</span>
                    <span>{quizState.score} pts</span>
                  </div>
                </div>
                <div className="quiz-question">
                  {currentQuiz ? currentQuiz.questionText : 'A carregar pergunta...'}
                </div>
                <div className="quiz-options">
                  {currentQuiz?.options?.map((option, index) => {
                    const selected = quizState.selectedOption === index;
                    const correct = quizState.answered && index === currentQuiz.correctOptionIndex;
                    const wrong = quizState.answered && selected && index !== currentQuiz.correctOptionIndex;
                    return (
                      <button
                        key={index}
                        className={`quiz-option ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
                        onClick={() => answerQuestion(index)}
                        disabled={quizState.answered}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {quizState.resultVisible ? (
                  <div className="quiz-result-panel">
                    <div className="quiz-result-card">
                      <div className="result-ring">
                        <div className="result-number">{quizState.resultPct}%</div>
                      </div>
                      <div className="result-summary">
                        <h3>Resultado final</h3>
                        <p>Acertaste <strong>{quizState.correct}</strong> e erraste <strong>{quizState.wrong}</strong> de <strong>{quizState.questions.length}</strong> perguntas.</p>
                        <p>Score final: <strong>{quizState.score}</strong> pontos.</p>
                        <p>{quizState.resultPct >= 80 ? 'Excelente! Continua assim.' : quizState.resultPct >= 50 ? 'Bom trabalho! Treina mais para subir no ranking.' : 'Precisas de mais prática. Tenta outro desafio agora.'}</p>
                      </div>
                    </div>
                    <div className="quiz-actions">
                      <button className="btn btn-primary" onClick={restartQuiz}>Repetir Quiz</button>
                      <button className="btn btn-secondary" onClick={() => setActiveTab('courses')}>Ver Cursos</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {quizState.answered && (
                      <div className="quiz-feedback">
                        <strong>Explicação:</strong> {currentQuiz.explanation}
                      </div>
                    )}
                    <div className="quiz-actions">
                      {quizState.answered ? (
                        <button className="btn btn-primary" onClick={nextQuestion}>
                          {quizState.currentIndex + 1 >= quizState.questions.length ? 'Ver Resultado' : 'Próxima pergunta'}
                        </button>
                      ) : (
                        <button className="btn btn-ghost" disabled>
                          Seleciona uma resposta
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={restartQuiz}>
                        Reiniciar Quiz
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="sl" style={{ marginTop: 60, textAlign: 'center' }}>Corretoras e Carteiras Recomendadas</div>
            <div className="mode-grid" style={{ marginBottom: 40 }}>
              {BROKERS.map((broker) => (
                <a key={broker.id} href={broker.href} target="_blank" rel="noreferrer" className="mode-card" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <div className="mode-title">{broker.title}</div>
                    <div className="mode-sub">{broker.label}</div>
                  </div>
                  <span style={{ color: broker.color, fontSize: 22 }}>{broker.id.toUpperCase()}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'courses' && (
          <section className="tab-content">
            <div className="hero">
              <h1 className="hero-title">
                <span className="nb">ACADEMIA</span> DE TRADING<br />
                <span className="ng">APRENDE GRÁTIS</span>
              </h1>
              <p className="hero-sub">Cursos completos de trading e criptomoedas. Desenvolve as tuas habilidades e acompanha o teu progresso.</p>
            </div>
            {!selectedCourse ? (
              <>
                <div className="sl">Cursos Disponíveis</div>
                <div className="courses-grid">
                  {courses.map((course) => (
                    <article key={course.id} className="course-card" onClick={() => openCourseDetail(course)} style={{ cursor: 'pointer' }}>
                      <div className="cc-thumb">
                        <img src={course.thumbnail} alt={course.title} />
                        <span className={`cc-category-badge ${course.category}`}>{course.category}</span>
                      </div>
                      <div className="cc-body">
                        <div className="cc-title">{course.title}</div>
                        <div className="cc-desc">{course.description}</div>
                        <div className="cc-meta">
                          <span className={`cc-level ${course.level}`}>{course.level}</span>
                          <span>{course.totalLessons} aulas</span>
                        </div>
                        <div className="course-card-progress">
                          <div className="progress-label">Progresso</div>
                          <div className="progress-row">
                            <span>{getCourseProgressData(course).completed}/{getCourseProgressData(course).totalLessons}</span>
                            <span>{getCourseProgressData(course).pct}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${getCourseProgressData(course).pct}%` }} />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="live-room-section">
                  <div className="sl">Salas ao vivo</div>
                  <div className="live-room-grid">
                    {liveRooms.slice().sort((a, b) => {
                      const liveA = a.isLive ? 0 : 1;
                      const liveB = b.isLive ? 0 : 1;
                      if (liveA !== liveB) return liveA - liveB;
                      return a.startTime.localeCompare(b.startTime);
                    }).map((room) => {
                      const instructor = instructors.find((inst) => inst.id === room.instructorId);
                      return (
                        <article key={room.roomId} className={`live-room-card ${room.isLive ? 'live-now' : ''}`}>
                          <div>
                            <div className="live-room-title">{room.title}</div>
                            <div className="live-room-meta">{instructor?.name || room.instructorId} · {room.startTime.replace('T', ' ')} → {room.endTime.replace('T', ' ')}</div>
                          </div>
                          <button className="btn btn-primary" onClick={() => joinLiveRoom(room)}>
                            {room.isLive ? 'Entrar agora' : 'Abrir sala'}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="course-detail">
                <div className="course-detail-bar">
                  <button className="btn btn-ghost" onClick={closeCourseDetail}>← Voltar aos cursos</button>
                  <div>
                    <div className="cc-title">{selectedCourse.title}</div>
                    <div className="cc-desc">{selectedCourse.description}</div>
                  </div>
                  <div className="course-progress-badge">{courseProgress.completedLessons.length}/{courseLessons.length} concluídas</div>
                </div>
                <div className="course-detail-grid">
                  <aside className="lesson-sidebar">
                    <div className="sidebar-header">Aulas</div>
                    {courseLessons.map((lesson) => {
                      const completed = courseProgress.completedLessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          className={`lesson-item-btn ${activeLessonId === lesson.id ? 'active' : ''} ${completed ? 'completed' : ''}`}
                          onClick={() => selectLesson(lesson.id)}
                        >
                          <div>{lesson.title}</div>
                          <small>{lesson.module}</small>
                          {completed && <span className="lesson-completed">Concluída</span>}
                        </button>
                      );
                    })}
                  </aside>
                  <article className="lesson-content">
                    {courseLessons.length === 0 ? (
                      <div className="loading-state">Ainda não existem aulas para este curso.</div>
                    ) : (
                      (() => {
                        const activeLesson = courseLessons.find((lesson) => lesson.id === activeLessonId) || courseLessons[0];
                        const completed = courseProgress.completedLessons.includes(activeLesson.id);
                        return (
                          <>
                            <div className="course-lesson-header">
                              <div>
                                <div className="cc-title">{activeLesson.title}</div>
                                <div className="cc-desc">{activeLesson.description}</div>
                              </div>
                              <button
                                className="btn btn-primary"
                                disabled={completed}
                                onClick={() => completeLesson(activeLesson.id)}
                              >
                                {completed ? 'Aula concluída' : 'Concluir Aula ✓'}
                              </button>
                            </div>
                            <div className="lesson-body">
                              <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                              {activeLesson.videoUrl && (
                                <a href={activeLesson.videoUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 16 }}>
                                  Ver vídeo da aula
                                </a>
                              )}
                            </div>
                            {selectedInstructor && (
                              <div className="course-instructor-panel">
                                <div>
                                  <div className="cc-title">Instrutor</div>
                                  <div className="cc-desc">{selectedInstructor.name}</div>
                                </div>
                                <div className="instructor-meta">
                                  <span>{selectedInstructor.role}</span>
                                  <span className={`verified-pill ${selectedInstructor.verificationStatus === 'ADMIN_APPROVED' ? 'approved' : selectedInstructor.verificationStatus === 'RETAIL_VERIFIED' ? 'verified' : ''}`}>
                                    {selectedInstructor.verificationStatus === 'ADMIN_APPROVED' ? 'Verificado (Admin)' : selectedInstructor.verificationStatus === 'RETAIL_VERIFIED' ? 'Verificado' : 'Não verificado'}
                                  </span>
                                </div>
                              </div>
                            )}
                            {courseLiveRooms.length > 0 && (
                              <div className="course-live-rooms">
                                <h3>Salas ao vivo relacionadas</h3>
                                <div className="live-room-grid-sm">
                                  {courseLiveRooms.map((room) => {
                                    const instructor = instructors.find((inst) => inst.id === room.instructorId);
                                    return (
                                      <article key={room.roomId} className={`live-room-card ${room.isLive ? 'live-now' : ''}`}>
                                        <div>
                                          <div className="live-room-title">{room.title}</div>
                                          <div className="live-room-meta">{instructor?.name || room.instructorId} · {room.startTime.replace('T', ' ')} → {room.endTime.replace('T', ' ')}</div>
                                        </div>
                                        <button className="btn btn-primary" onClick={() => joinLiveRoom(room)}>
                                          {room.isLive ? 'Entrar agora' : 'Abrir sala'}
                                        </button>
                                      </article>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            {courseQuizzes.length > 0 && (
                              <div className="course-quiz-list">
                                <h3>Quizzes deste curso</h3>
                                <div className="quiz-list-grid">
                                  {courseQuizzes.map((quiz) => (
                                    <article key={quiz.id} className="quiz-card-small">
                                      <div>
                                        <div className="quiz-card-title">{quiz.title}</div>
                                        <div className="quiz-card-meta">{quiz.difficulty} · {quiz.timeLimit}s</div>
                                      </div>
                                      <button className="btn btn-primary" onClick={() => startCourseQuiz(quiz)}>
                                        Iniciar
                                      </button>
                                    </article>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()
                    )}
                  </article>
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'videos' && (
          <section className="tab-content">
            <div className="videos-hero">
              <h2>
                <span className="nb">APRENDE</span> A NEGOCIAR<br />
                <span className="ng">PASSO A PASSO</span>
              </h2>
              <p>Tutoriais em vídeo para te ajudar a registar e começar nas melhores plataformas de trading.</p>
            </div>
            <div className="video-filter">
              {['todos', 'binance', 'quotex', 'deriv', 'trading'].map((category) => (
                <button
                  key={category}
                  className={`vf-btn ${videoFilter === category ? 'active' : ''}`}
                  onClick={() => setVideoFilter(category)}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="videos-grid">
              {filteredVideos.map((video) => (
                <article key={video.id} className="video-card">
                  <div className="video-card-thumb">
                    <div className="video-tag">{video.tag}</div>
                    <div className="video-provider">{video.provider}</div>
                  </div>
                  <div className="video-card-body">
                    <h3>{video.title}</h3>
                    <a href={video.url} target="_blank" rel="noreferrer" className="btn btn-ghost">Ver vídeo</a>
                  </div>
                </article>
              ))}
            </div>
            <div className="video-cta-panel">
              <h3>Mais vídeos a caminho</h3>
              <p>Siga-nos no TikTok para não perder nenhum tutorial novo.</p>
              <a href="https://tiktok.com/@TradingAOao" target="_blank" rel="noreferrer" className="btn btn-primary">🎵 @TradingAOao no TikTok</a>
            </div>
          </section>
        )}

        {activeTab === 'ranking' && (
          <section className="tab-content">
            <div className="sl" style={{ marginTop: 8 }}>Ranking global</div>
            <div className="rank-filter">
              {['todos', 'forex', 'cripto', 'quotex', 'trading', 'binance'].map((mode) => (
                <button
                  key={mode}
                  className={`vf-btn ${rankFilter === mode ? 'active' : ''}`}
                  onClick={() => setRankFilter(mode)}
                >
                  {mode === 'todos' ? 'TODOS' : mode.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <div className="rank-header">
                <div>#</div>
                <div>Jogador</div>
                <div>Modo</div>
                <div>Pts</div>
              </div>
              <div>
                {filteredRanking.map((row, index) => (
                  <div key={row.id} className="rank-row">
                    <div className={index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}>
                      {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                    </div>
                    <div className="rank-name">{row.username}</div>
                    <div className="rank-mode">{row.mode}</div>
                    <div className="rank-score">{row.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'mercado' && (
          <section className="tab-content">
            <div className="hero" style={{ padding: '20px 0 28px', textAlign: 'center' }}>
              <h2 className="hero-title">
                <span className="nb">MERCADO</span> FINANCEIRO<br />
                <span className="ng">MUNDIAL</span>
              </h2>
              <p className="hero-sub">Acompanha índices, commodities, criptos e notícias com mais agilidade.</p>
            </div>
            <div className="video-filter" id="mercado-subtabs" style={{ justifyContent: 'center', marginBottom: 20 }}>
              <button className={`vf-btn ${marketTab === 'quotes' ? 'active' : ''}`} onClick={() => setMarketTab('quotes')}>COTAÇÕES & CALENDÁRIO</button>
              <button className={`vf-btn ${marketTab === 'news' ? 'active' : ''}`} onClick={() => setMarketTab('news')}>NOTÍCIAS DO MERCADO</button>
            </div>
            {marketTab === 'quotes' ? (
              <>
                <div className="sl" style={{ marginBottom: 14 }}>🌍 Índices Mundiais</div>
                <div className="market-grid">
                  {MARKET_INDICES.map((item) => (
                    <a key={item.id} className={`market-info-card ${item.id}`} href="#" onClick={(e) => e.preventDefault()}>
                      <div style={{ fontWeight: '700', marginBottom: 8 }}>{item.name}</div>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{item.value}</div>
                      <div style={{ color: item.color }}>{item.change}</div>
                      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>{item.type}</div>
                    </a>
                  ))}
                </div>
                <div className="sl" style={{ marginBottom: 14 }}>📰 Notícias Recentes do Mercado</div>
                <div className="news-grid">
                  {MARKET_NEWS.map((item) => (
                    <article key={item.id} className="news-card">
                      <div className="news-tag">{item.category}</div>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <div className="news-date">{item.date}</div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="news-grid" style={{ gridTemplateColumns: '1fr', gap: 20 }}>
                {MARKET_NEWS.map((item) => (
                  <article key={item.id} className="news-card">
                    <div className="news-tag">{item.category}</div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <div className="news-date">{item.date}</div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'admin' && (
          <section className="tab-content">
            <div className="hero" style={{ padding: '20px 0 10px' }}>
              <h2 className="hero-title" style={{ fontSize: 'clamp(18px, 4vw, 28px)' }}>
                <span className="nb">PAINEL DE</span> CONTROLO<br />
                <span className="ng">ADMINISTRAÇÃO</span>
              </h2>
              <p className="hero-sub" style={{ marginBottom: 12 }}>Gestão de conteúdos educativos da TradingAO.</p>
              <button className="btn btn-green" onClick={() => window.location.reload()}>
                🌱 Semear Base de Dados
              </button>
            </div>
            <div className="video-filter" style={{ justifyContent: 'center', marginBottom: 20 }}>
              {ADMIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`vf-btn ${adminTab === tab.id ? 'active' : ''}`}
                  onClick={() => setAdminTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="sl" style={{ marginBottom: 0 }}>
                Gestão de {adminTab === 'courses' ? 'Cursos' : adminTab === 'lessons' ? 'Aulas' : adminTab === 'quizzes' ? 'Quizzes' : adminTab === 'questions' ? 'Perguntas' : adminTab === 'instructors' ? 'Instrutores' : 'Salas Ao Vivo'}
              </div>
              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11, fontFamily: 'Orbitron, monospace' }} onClick={() => openAdminForm(adminTab, 'create')}>
                + NOVO REGISTO
              </button>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--r)', overflowX: 'auto' }}>
              {adminTab === 'courses' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>CAPA</th>
                      <th>TÍTULO / ID</th>
                      <th>CATEGORIA</th>
                      <th>NÍVEL</th>
                      <th>ESTADO</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td><img src={course.thumbnail} alt={course.title} style={{ width: 60, height: 34, objectFit: 'cover', borderRadius: 4 }} /></td>
                        <td>{course.title}<br /><small>ID: {course.id}</small></td>
                        <td>{course.category}</td>
                        <td>{course.level}</td>
                        <td>{course.published ? 'Publicado' : 'Rascunho'}</td>
                        <td>
                          <button className="btn" onClick={() => openAdminForm('courses', 'edit', course)}>Editar</button>
                          <button className="btn btn-danger" onClick={() => deleteAdminItem(course.id)}>Apagar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {adminTab === 'instructors' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>INSTRUTOR</th>
                      <th>FUNÇÃO</th>
                      <th>STATUS</th>
                      <th>WEBSITE</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.map((inst) => (
                      <tr key={inst.id}>
                        <td>{inst.name}<br /><small>ID: {inst.id}</small></td>
                        <td>{inst.role}</td>
                        <td>{inst.verificationStatus}</td>
                        <td>{inst.website}</td>
                        <td>
                          <button className="btn" onClick={() => openAdminForm('instructors', 'edit', inst)}>Editar</button>
                          <button className="btn btn-danger" onClick={() => deleteAdminItem(inst.id)}>Apagar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {adminTab === 'lessons' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>AULA</th>
                      <th>CURSO</th>
                      <th>MÓDULO</th>
                      <th>TIPO</th>
                      <th>ORDEM</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td>{lesson.title}<br /><small>{lesson.id}</small></td>
                        <td>{(courses.find((course) => course.id === lesson.courseId) || {}).title || lesson.courseId}</td>
                        <td>{lesson.module}</td>
                        <td>{lesson.contentType}</td>
                        <td>{lesson.order}</td>
                        <td>
                          <button className="btn" onClick={() => openAdminForm('lessons', 'edit', lesson)}>Editar</button>
                          <button className="btn btn-danger" onClick={() => deleteAdminItem(lesson.id)}>Apagar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {adminTab === 'quizzes' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>QUIZ</th>
                      <th>CURSO</th>
                      <th>CATEGORIA</th>
                      <th>DIFICULDADE</th>
                      <th>TEMPO</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz) => (
                      <tr key={quiz.id}>
                        <td>{quiz.title}<br /><small>{quiz.id}</small></td>
                        <td>{(courses.find((course) => course.id === quiz.courseId) || {}).title || quiz.courseId}</td>
                        <td>{quiz.category}</td>
                        <td>{quiz.difficulty}</td>
                        <td>{quiz.timeLimit}s</td>
                        <td>
                          <button className="btn" onClick={() => openAdminForm('quizzes', 'edit', quiz)}>Editar</button>
                          <button className="btn btn-danger" onClick={() => deleteAdminItem(quiz.id)}>Apagar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {adminTab === 'questions' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Pergunta</th>
                      <th>Quiz</th>
                      <th>Opções</th>
                      <th>Correta</th>
                      <th>Ordem</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.id}>
                        <td>{question.questionText}<br /><small>{question.id}</small></td>
                        <td>{(quizzes.find((quiz) => quiz.id === question.quizId) || {}).title || question.quizId}</td>
                        <td>{question.options?.length || 0}</td>
                        <td>{question.options?.[question.correctOptionIndex] || '-'}</td>
                        <td>{question.order}</td>
                        <td>
                          <button className="btn" onClick={() => openAdminForm('questions', 'edit', question)}>Editar</button>
                          <button className="btn btn-danger" onClick={() => deleteAdminItem(question.id)}>Apagar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {adminTab === 'live_rooms' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>SALA</th>
                      <th>INSTRUTOR</th>
                      <th>HORÁRIO</th>
                      <th>STATUS</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveRooms.map((room) => (
                      <tr key={room.roomId}>
                        <td>{room.title}<br /><small>{room.roomId}</small></td>
                        <td>{(instructors.find((inst) => inst.id === room.instructorId) || {}).name || room.instructorId}</td>
                        <td>{room.startTime.replace('T', ' ')} → {room.endTime.replace('T', ' ')}</td>
                        <td>{room.isLive ? 'Ao Vivo' : 'Agendada'}</td>
                        <td>
                          <button className="btn" onClick={() => openAdminForm('live_rooms', 'edit', room)}>Editar</button>
                          <button className="btn btn-danger" onClick={() => deleteAdminItem(room.roomId)}>Apagar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {adminTab !== 'courses' && adminTab !== 'instructors' && adminTab !== 'live_rooms' && (
                <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'Orbitron, monospace', fontSize: 12 }}>
                  Esta secção está em desenvolvimento. O design do painel administrativo já está disponível em React.
                </div>
              )}
            </div>
          </section>
        )}

        {adminFormVisible && (
          <div className="admin-modal-overlay" onClick={closeAdminForm}>
            <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <div className="cc-title">{adminFormMode === 'create' ? 'Novo registo' : 'Editar registo'}</div>
                  <div className="cc-desc">{adminFormType === 'courses' ? 'Curso' : adminFormType === 'instructors' ? 'Instrutor' : 'Sala ao vivo'}</div>
                </div>
                <button className="btn btn-ghost" onClick={closeAdminForm}>Fechar</button>
              </div>
              <div className="admin-modal-body">
                {adminFormType === 'courses' && (
                  <>
                    <label>ID do Curso</label>
                    <input value={adminFormData.id || ''} onChange={(e) => handleAdminFormChange('id', e.target.value)} placeholder="curso-id" />
                    <label>Título</label>
                    <input value={adminFormData.title || ''} onChange={(e) => handleAdminFormChange('title', e.target.value)} placeholder="Título do curso" />
                    <label>Descrição</label>
                    <textarea value={adminFormData.description || ''} onChange={(e) => handleAdminFormChange('description', e.target.value)} placeholder="Descrição" rows={4} />
                    <label>Categoria</label>
                    <input value={adminFormData.category || ''} onChange={(e) => handleAdminFormChange('category', e.target.value)} placeholder="forex, cripto, quotex" />
                    <label>Nível</label>
                    <select value={adminFormData.level || 'iniciante'} onChange={(e) => handleAdminFormChange('level', e.target.value)}>
                      <option value="iniciante">iniciante</option>
                      <option value="médio">médio</option>
                      <option value="avançado">avançado</option>
                    </select>
                    <label>Thumbnail</label>
                    <input value={adminFormData.thumbnail || ''} onChange={(e) => handleAdminFormChange('thumbnail', e.target.value)} placeholder="URL da imagem" />
                    <label>Publicado</label>
                    <select value={String(adminFormData.published)} onChange={(e) => handleAdminFormChange('published', e.target.value === 'true')}>
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </>
                )}
                {adminFormType === 'instructors' && (
                  <>
                    <label>ID</label>
                    <input value={adminFormData.id || ''} onChange={(e) => handleAdminFormChange('id', e.target.value)} placeholder="instrutor-id" />
                    <label>Nome</label>
                    <input value={adminFormData.name || ''} onChange={(e) => handleAdminFormChange('name', e.target.value)} placeholder="Nome do instrutor" />
                    <label>Função</label>
                    <input value={adminFormData.role || ''} onChange={(e) => handleAdminFormChange('role', e.target.value)} placeholder="Trader Senior, Analista..." />
                    <label>Website</label>
                    <input value={adminFormData.website || ''} onChange={(e) => handleAdminFormChange('website', e.target.value)} placeholder="https://..." />
                    <label>Status de Verificação</label>
                    <select value={adminFormData.verificationStatus || 'RETAIL_VERIFIED'} onChange={(e) => handleAdminFormChange('verificationStatus', e.target.value)}>
                      <option value="RETAIL_VERIFIED">RETAIL_VERIFIED</option>
                      <option value="ADMIN_APPROVED">ADMIN_APPROVED</option>
                      <option value="UNVERIFIED">UNVERIFIED</option>
                    </select>
                  </>
                )}
                {adminFormType === 'lessons' && (
                  <>
                    <label>ID</label>
                    <input value={adminFormData.id || ''} onChange={(e) => handleAdminFormChange('id', e.target.value)} placeholder="lesson-id" />
                    <label>Curso</label>
                    <select value={adminFormData.courseId || ''} onChange={(e) => handleAdminFormChange('courseId', e.target.value)}>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                    <label>Módulo</label>
                    <input value={adminFormData.module || ''} onChange={(e) => handleAdminFormChange('module', e.target.value)} placeholder="Módulo" />
                    <label>Título</label>
                    <input value={adminFormData.title || ''} onChange={(e) => handleAdminFormChange('title', e.target.value)} placeholder="Título da aula" />
                    <label>Descrição</label>
                    <textarea value={adminFormData.description || ''} onChange={(e) => handleAdminFormChange('description', e.target.value)} placeholder="Descrição" rows={3} />
                    <label>Tipo</label>
                    <select value={adminFormData.contentType || 'text'} onChange={(e) => handleAdminFormChange('contentType', e.target.value)}>
                      <option value="text">Texto</option>
                      <option value="video">Video</option>
                      <option value="mixed">Misto</option>
                    </select>
                    <label>Conteúdo</label>
                    <textarea value={adminFormData.content || ''} onChange={(e) => handleAdminFormChange('content', e.target.value)} placeholder="Conteúdo html/texto" rows={4} />
                    <label>URL do vídeo (opcional)</label>
                    <input value={adminFormData.videoUrl || ''} onChange={(e) => handleAdminFormChange('videoUrl', e.target.value)} placeholder="https://..." />
                    <label>Ordem</label>
                    <input type="number" value={adminFormData.order || 1} onChange={(e) => handleAdminFormChange('order', e.target.value)} />
                  </>
                )}
                {adminFormType === 'quizzes' && (
                  <>
                    <label>ID</label>
                    <input value={adminFormData.id || ''} onChange={(e) => handleAdminFormChange('id', e.target.value)} placeholder="quiz-id" />
                    <label>Curso</label>
                    <select value={adminFormData.courseId || ''} onChange={(e) => handleAdminFormChange('courseId', e.target.value)}>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                    <label>Título</label>
                    <input value={adminFormData.title || ''} onChange={(e) => handleAdminFormChange('title', e.target.value)} placeholder="Título do quiz" />
                    <label>Descrição</label>
                    <textarea value={adminFormData.description || ''} onChange={(e) => handleAdminFormChange('description', e.target.value)} placeholder="Descrição" rows={3} />
                    <label>Categoria</label>
                    <input value={adminFormData.category || ''} onChange={(e) => handleAdminFormChange('category', e.target.value)} placeholder="forex, cripto, quotex" />
                    <label>Dificuldade</label>
                    <select value={adminFormData.difficulty || 'facil'} onChange={(e) => handleAdminFormChange('difficulty', e.target.value)}>
                      <option value="facil">fácil</option>
                      <option value="medio">médio</option>
                      <option value="avancado">avançado</option>
                    </select>
                    <label>Tempo limite (segundos)</label>
                    <input type="number" value={adminFormData.timeLimit || 120} onChange={(e) => handleAdminFormChange('timeLimit', e.target.value)} />
                  </>
                )}
                {adminFormType === 'questions' && (
                  <>
                    <label>ID</label>
                    <input value={adminFormData.id || ''} onChange={(e) => handleAdminFormChange('id', e.target.value)} placeholder="question-id" />
                    <label>Quiz</label>
                    <select value={adminFormData.quizId || ''} onChange={(e) => handleAdminFormChange('quizId', e.target.value)}>
                      {quizzes.map((quiz) => (
                        <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                      ))}
                    </select>
                    <label>Pergunta</label>
                    <textarea value={adminFormData.questionText || ''} onChange={(e) => handleAdminFormChange('questionText', e.target.value)} placeholder="Texto da pergunta" rows={3} />
                    <label>Opções (separadas por vírgula)</label>
                    <input value={Array.isArray(adminFormData.options) ? adminFormData.options.join(', ') : adminFormData.options || ''} onChange={(e) => handleAdminFormChange('options', e.target.value)} placeholder="Opção 1, Opção 2, Opção 3, Opção 4" />
                    <label>Índice da resposta correta</label>
                    <input type="number" value={adminFormData.correctOptionIndex || 0} onChange={(e) => handleAdminFormChange('correctOptionIndex', e.target.value)} min={0} max={3} />
                    <label>Explicação</label>
                    <textarea value={adminFormData.explanation || ''} onChange={(e) => handleAdminFormChange('explanation', e.target.value)} placeholder="Explicação da resposta" rows={3} />
                    <label>Ordem</label>
                    <input type="number" value={adminFormData.order || 1} onChange={(e) => handleAdminFormChange('order', e.target.value)} />
                  </>
                )}
                {adminFormType === 'live_rooms' && (
                  <>
                    <label>ID da Sala</label>
                    <input value={adminFormData.roomId || ''} onChange={(e) => handleAdminFormChange('roomId', e.target.value)} placeholder="sala-id" />
                    <label>Título</label>
                    <input value={adminFormData.title || ''} onChange={(e) => handleAdminFormChange('title', e.target.value)} placeholder="Título da sala" />
                    <label>Instrutor</label>
                    <select value={adminFormData.instructorId || ''} onChange={(e) => handleAdminFormChange('instructorId', e.target.value)}>
                      {instructors.map((inst) => (
                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                      ))}
                    </select>
                    <label>Início</label>
                    <input type="datetime-local" value={adminFormData.startTime || ''} onChange={(e) => handleAdminFormChange('startTime', e.target.value)} />
                    <label>Fim</label>
                    <input type="datetime-local" value={adminFormData.endTime || ''} onChange={(e) => handleAdminFormChange('endTime', e.target.value)} />
                    <label>Ao Vivo</label>
                    <select value={String(adminFormData.isLive)} onChange={(e) => handleAdminFormChange('isLive', e.target.value === 'true')}>
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </>
                )}
              </div>
              <div className="admin-modal-foot">
                <button className="btn btn-secondary" onClick={closeAdminForm}>Cancelar</button>
                <button className="btn btn-primary" onClick={saveAdminItem}>{adminFormMode === 'create' ? 'Criar' : 'Salvar'}</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-t">TRADING</span><span className="footer-logo-a">AO</span><span className="footer-logo-d">.</span>
            </div>
            <p className="footer-desc">A plataforma de quiz de trading mais completa de Angola. Aprende, compete e cresce como trader.</p>
          </div>
          <div>
            <div className="footer-col-title">Suporte</div>
            <div className="footer-links">
              <a className="footer-link" href="#">Perguntas frequentes</a>
              <a className="footer-link" href="#">Guia de iniciante</a>
              <a className="footer-link" href="#">Chat de suporte</a>
              <a className="footer-link" href="#">Enviar email</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Corretoras</div>
            <div className="footer-links">
              <a className="footer-link" href="https://broker-qx.pro/sign-up/?lid=2076062" target="_blank" rel="noreferrer">Abrir conta Quotex</a>
              <a className="footer-link" href="https://track.deriv.com/_V1mBADAUk6W4zHaZIQMoUGNd7ZgqdRLk/1/" target="_blank" rel="noreferrer">Abrir conta Deriv</a>
              <a className="footer-link" href="https://www.binance.com/register?ref=1234866263" target="_blank" rel="noreferrer">Abrir conta Binance</a>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 TradingAO · Luanda, Angola · Todos os direitos reservados</div>
          <div className="footer-legal">
            <a href="#">Termos de uso</a>
            <a href="#">Privacidade</a>
            <a href="#">Cookies</a>
            <a href="#">Reclamações</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
