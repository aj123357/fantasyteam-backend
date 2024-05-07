// // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// const { initializeApp } = require("firebase/app");
// const { getFirestore, getDocs, collection } = require("firebase/firestore");

// // import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration

// const db = getFirestore();

// module.exports = {db};
const firebase = require("firebase/app")
const auth = require("firebase/auth")
const admin = require("firebase-admin")
const { serviceAccount } = require("./serviceAccountKey")
const firestore = require("firebase/firestore")
const adminauth = require("firebase-admin/auth")
const { firebaseConfig } = require("./Constant")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://default.firebaseio.com"
})

// // Initialize Firebase
// initializeApp(firebaseConfig);
const app = firebase.initializeApp(firebaseConfig)


const db = firestore.getFirestore(app)
const admindb = admin.firestore()
const adminAuth = adminauth.getAuth()
const getAuth = auth.getAuth(app)

module.exports = {
    db, admindb, getAuth, adminAuth
}