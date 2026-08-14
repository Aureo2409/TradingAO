import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => value && !value.includes('YOUR_'));
let db;
let auth;

export const FirebaseBridge = {
  isConfigured: false,
  init: async () => {
    if (!hasFirebaseConfig) {
      console.warn('Firebase não está configurado. O app funcionará com dados locais.');
      return;
    }

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    FirebaseBridge.isConfigured = true;
  },
  getCourses: async () => {
    if (!FirebaseBridge.isConfigured) return [];
    const snapshot = await getDocs(collection(db, 'courses'));
    const list = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    return list;
  },
  getLessons: async () => {
    if (!FirebaseBridge.isConfigured) return [];
    const snapshot = await getDocs(collection(db, 'lessons'));
    const list = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    return list;
  },
  getQuizzes: async () => {
    if (!FirebaseBridge.isConfigured) return [];
    const snapshot = await getDocs(collection(db, 'quizzes'));
    const list = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    return list;
  },
  getQuestions: async (quizId = null) => {
    if (!FirebaseBridge.isConfigured) return [];
    let q;
    if (quizId) {
      q = query(collection(db, 'questions'), where('quizId', '==', quizId), orderBy('order', 'asc'));
    } else {
      q = query(collection(db, 'questions'), orderBy('order', 'asc'));
    }
    const snapshot = await getDocs(q);
    const list = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    return list;
  },
  getInstructors: async () => {
    if (!FirebaseBridge.isConfigured) return [];
    const snapshot = await getDocs(collection(db, 'instructors'));
    const list = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    return list;
  },
  getLiveRooms: async () => {
    if (!FirebaseBridge.isConfigured) return [];
    const snapshot = await getDocs(collection(db, 'live_rooms'));
    const list = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    return list;
  }
};
