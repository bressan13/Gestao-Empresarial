import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBZH3p4yjo8yZM9-N5h_Z5OUXyqOgHKKYY",
  authDomain: "gestao-empresarial-bolt.firebaseapp.com",
  projectId: "gestao-empresarial-bolt",
  storageBucket: "gestao-empresarial-bolt.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);