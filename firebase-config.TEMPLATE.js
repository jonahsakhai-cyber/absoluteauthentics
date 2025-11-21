// Firebase Configuration Template
// 
// INSTRUCTIONS:
// 1. Copy this file and rename it to: firebase-config.js
// 2. Replace all YOUR_* placeholders with your actual Firebase credentials
// 3. Get credentials from: Firebase Console → Project Settings → Your apps → Web app
// 4. NEVER commit firebase-config.js to GitHub (it's in .gitignore)

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, query, where, orderBy, limit, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// YOUR FIREBASE CONFIG
// Get this from: Firebase Console → ⚙️ Project Settings → Your apps → </> Web
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",                    // Example: "AIzaSyD1234567890abcdefghijk"
  authDomain: "YOUR_PROJECT.firebaseapp.com",     // Example: "absolute-authentics.firebaseapp.com"
  projectId: "YOUR_PROJECT_ID",                   // Example: "absolute-authentics"
  storageBucket: "YOUR_PROJECT.appspot.com",      // Example: "absolute-authentics.appspot.com"
  messagingSenderId: "YOUR_SENDER_ID",            // Example: "123456789012"
  appId: "YOUR_APP_ID"                            // Example: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { 
  db, 
  storage, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc,
  serverTimestamp,
  ref, 
  uploadBytes, 
  getDownloadURL 
};

console.log('✅ Firebase initialized successfully');
