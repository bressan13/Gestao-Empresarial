import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Certifique-se de que o Firestore é importado aqui

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBmtfLl__OXeZ6pqEh_o-ilPGPnXO7v0MY", // Substitua com sua chave
  authDomain: "gestao-empresarial-19ae4.firebaseapp.com", // Substitua com seu authDomain
  projectId: "gestao-empresarial-19ae4", // Substitua com seu projectId
  storageBucket: "gestao-empresarial-19ae4.appspot.com", // Substitua com seu storageBucket
  messagingSenderId: "519825597244", // Substitua com seu messagingSenderId
  appId: "1:519825597244:web:0f882d16d60c1f9b85e7d3", // Substitua com seu appId
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializações únicas
const auth = getAuth(app);
const db = getFirestore(app); // Certifique-se de que o Firestore está sendo inicializado corretamente

// Provedor do Google para autenticação
const googleProvider = new GoogleAuthProvider();

// Exportações
export { auth, db, googleProvider, signInWithPopup, signOut, signInWithEmailAndPassword };
