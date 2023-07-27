import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  showLoginForm,
  showLoginError,
  btnLogin,
  btnSignup,
  btnLogout,
} from './ui';

const firebaseConfig = {
  apiKey: 'AIzaSyDSRKxsxYbCcR81Ulc3SRbFUPHSxZQE-gM',
  authDomain: 'filmoteka-062023.firebaseapp.com',
  projectId: 'filmoteka-062023',
  storageBucket: 'filmoteka-062023.appspot.com',
  messagingSenderId: '353476424296',
  appId: '1:353476424296:web:4aa3ad1396da44f6fc81dd',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login using email/password
const loginEmailPassword = async (loginEmail, loginPassword) => {
  try {
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
  } catch (error) {
    showLoginError(error);
  }
};

// Create new account using email/password
const createAccount = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    showLoginError(error);
  }
};
// Log out
const logout = async () => {
  await signOut(auth);
};
export {
  logout,
  createAccount,
  loginEmailPassword,
  onAuthStateChanged,
  auth,
  app,
};
