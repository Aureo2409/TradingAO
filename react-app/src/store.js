import { FirebaseBridge } from './firebase';
import {
  COURSES,
  LESSONS,
  QUIZZES,
  QUESTIONS,
  NEWS,
  INSTRUCTORS,
  LIVE_ROOMS,
  RANKING
} from './data';

const KEY_PREFIX = 'tao_';

const getKey = (key) => `${KEY_PREFIX}${key}`;
const parseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const getLocal = (key, fallback = null) => {
  const value = localStorage.getItem(getKey(key));
  if (value === null || value === undefined) return fallback;
  const parsed = parseJson(value);
  return parsed === null ? fallback : parsed;
};

const setLocal = (key, value) => {
  localStorage.setItem(getKey(key), JSON.stringify(value));
};

const seedLocalData = () => {
  if (getLocal('seeded')) return;
  setLocal('courses', COURSES);
  setLocal('lessons', LESSONS);
  setLocal('quizzes', QUIZZES);
  setLocal('questions', QUESTIONS);
  setLocal('news', NEWS);
  setLocal('instructors', INSTRUCTORS);
  setLocal('live_rooms', LIVE_ROOMS);
  setLocal('scores', RANKING);
  setLocal('seeded', true);
};

const firebaseOrLocal = async (key, firebaseFn, fallback) => {
  if (FirebaseBridge.isConfigured && typeof FirebaseBridge[firebaseFn] === 'function') {
    try {
      return await FirebaseBridge[firebaseFn]();
    } catch (error) {
      console.warn(`Firebase ${firebaseFn} failed`, error);
    }
  }
  return fallback();
};

const createLocalCrud = (key, defaultValue = []) => ({
  list: async () => getLocal(key, defaultValue),
  save: async (item, idKey = 'id') => {
    const list = getLocal(key, defaultValue);
    const id = item[idKey] || item.id || item.roomId || item.uid;
    if (!id) {
      throw new Error(`Item ID obrigatório para ${key}`);
    }
    const index = list.findIndex((entry) => entry[idKey] === id || entry.id === id || entry.roomId === id || entry.uid === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...item, [idKey]: id };
    } else {
      list.push({ ...item, [idKey]: id });
    }
    setLocal(key, list);
    return list;
  },
  delete: async (id, idKey = 'id') => {
    const list = getLocal(key, defaultValue);
    const updated = list.filter((entry) => entry[idKey] !== id && entry.id !== id && entry.roomId !== id && entry.uid !== id);
    setLocal(key, updated);
    return updated;
  }
});

const courseCrud = createLocalCrud('courses', COURSES);
const lessonCrud = createLocalCrud('lessons', LESSONS);
const quizCrud = createLocalCrud('quizzes', QUIZZES);
const questionCrud = createLocalCrud('questions', QUESTIONS);
const instructorCrud = createLocalCrud('instructors', INSTRUCTORS);
const liveRoomCrud = createLocalCrud('live_rooms', LIVE_ROOMS);
const newsCrud = createLocalCrud('news', NEWS);
const scoreCrud = createLocalCrud('scores', RANKING);

const progressKey = (courseId) => `progress_${courseId}`;

export const Store = {
  init: async () => {
    seedLocalData();
    if (FirebaseBridge.isConfigured && FirebaseBridge.init) {
      await FirebaseBridge.init();
    }
  },

  get: (key, fallback = null) => getLocal(key, fallback),
  set: (key, value) => setLocal(key, value),

  courses: async () => firebaseOrLocal('courses', 'getCourses', () => getLocal('courses', COURSES)),
  saveCourse: async (course) => courseCrud.save(course, 'id'),
  deleteCourse: async (id) => courseCrud.delete(id, 'id'),

  lessons: async (courseId = null) => {
    if (FirebaseBridge.isConfigured && typeof FirebaseBridge.getLessons === 'function') {
      try {
        return await FirebaseBridge.getLessons(courseId);
      } catch (error) {
        console.warn('Firebase getLessons failed', error);
      }
    }
    const list = getLocal('lessons', LESSONS);
    const filtered = courseId ? list.filter((item) => item.courseId === courseId) : list;
    return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  saveLesson: async (lesson) => lessonCrud.save(lesson, 'id'),
  deleteLesson: async (id) => lessonCrud.delete(id, 'id'),

  quizzes: async () => firebaseOrLocal('quizzes', 'getQuizzes', () => getLocal('quizzes', QUIZZES)),
  saveQuiz: async (quiz) => quizCrud.save(quiz, 'id'),
  deleteQuiz: async (id) => quizCrud.delete(id, 'id'),

  questions: async (quizId = null) => {
    if (FirebaseBridge.isConfigured && typeof FirebaseBridge.getQuestions === 'function') {
      try {
        return await FirebaseBridge.getQuestions(quizId);
      } catch (error) {
        console.warn('Firebase getQuestions failed', error);
      }
    }
    const list = getLocal('questions', QUESTIONS);
    const filtered = quizId ? list.filter((item) => item.quizId === quizId) : list;
    return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  saveQuestion: async (question) => questionCrud.save(question, 'id'),
  deleteQuestion: async (id) => questionCrud.delete(id, 'id'),

  instructors: async () => firebaseOrLocal('instructors', 'getInstructors', () => getLocal('instructors', INSTRUCTORS)),
  saveInstructor: async (instructor) => instructorCrud.save(instructor, 'id'),
  deleteInstructor: async (id) => instructorCrud.delete(id, 'id'),

  liveRooms: async () => firebaseOrLocal('live_rooms', 'getLiveRooms', () => getLocal('live_rooms', LIVE_ROOMS)),
  saveLiveRoom: async (room) => liveRoomCrud.save(room, 'roomId'),
  deleteLiveRoom: async (id) => liveRoomCrud.delete(id, 'roomId'),

  news: async () => newsCrud.list(),
  saveNews: async (item) => newsCrud.save(item, 'id'),
  deleteNews: async (id) => newsCrud.delete(id, 'id'),

  scores: async () => scoreCrud.list(),
  addScore: async (entry) => {
    const list = await scoreCrud.list();
    const next = [...list, entry].sort((a, b) => b.score - a.score).slice(0, 200);
    setLocal('scores', next);
    return next;
  },

  getProgress: async (courseId) => getLocal(progressKey(courseId), { completedLessons: [] }),
  saveProgress: async (courseId, progress) => {
    setLocal(progressKey(courseId), progress);
    return progress;
  },

  resetSeed: async () => {
    localStorage.removeItem(getKey('seeded'));
    localStorage.removeItem(getKey('courses'));
    localStorage.removeItem(getKey('lessons'));
    localStorage.removeItem(getKey('quizzes'));
    localStorage.removeItem(getKey('questions'));
    localStorage.removeItem(getKey('news'));
    localStorage.removeItem(getKey('instructors'));
    localStorage.removeItem(getKey('live_rooms'));
    localStorage.removeItem(getKey('scores'));
    return Store.init();
  }
};
