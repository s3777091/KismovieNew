//Loading Firebase Package
var firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyB4hzppkuM7n5BBbd2Rsi-Ped5ZXz46wGM",
  authDomain: "kimovies.firebaseapp.com",
  projectId: "kimovies",
  storageBucket: "kimovies.appspot.com",
  messagingSenderId: "217538332875",
  appId: "1:217538332875:web:b5c4d88213c3c5d9cb334e",
  measurementId: "G-3Y5RBYLRHZ",
};
/**
 * Update your Firebase Project
 * Credentials and Firebase Database
 * URL
 */
firebase.initializeApp(firebaseConfig); //by adding your credentials, you get authorized to read and write from the database

var db = firebase.database();
const getListMovies = async () => {
  const refMovie = db.ref("/movies");

  const movies = await refMovie.once("value");
  console.log(movies.val());
  if (movies.val()) {
    let vals = Object.values(movies.val());
    let listLinkCloned = [];
    vals.map((mv) => listLinkCloned.push(mv.cloneLink));
    return listLinkCloned;
  } else {
    return [];
  }
};
const getRef = (refName) => {
  return db.ref(refName);
};
module.exports = { getRef, db, getListMovies };
