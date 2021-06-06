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

/**
 * Loading Firebase Database and refering
 * to user_data Object from the Database
 */
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

// var ref = db.ref("/movies"); //Set the current directory you are working in

// /**
//  * Setting Data Object Value
//  */
// ref.set([
//   {
//     id: 1,
//     movieThumb:{
//         full: 'https://i.ibb.co/nz8PJsx/34de2bd6c722.jpg',
//         thumb: 'https://i.ibb.co/xJ8FTSx/34de2bd6c722.jpg',
//         medium: 'https://i.ibb.co/0hVsbjH/34de2bd6c722.jpg'
//     },
//     title: "BlackPink: Thắp Sáng Bầu Trời –  BLACKPINK: Light Up the Sky",
//     description: `BLACKPINK – nhóm nhạc nữ Hàn Quốc phá vỡ nhiều kỷ lục – kể câu chuyện của họ và hành trình thực hiện ước mơ, vượt qua những thử thách đầy gian khổ phía sau ánh hào quang.blackpink thap sang bau troi`,
//     trial: "https://www.youtube.com/watch?v=7jx_vdvxWu0",
//     movieId: "123213"
//   },
// ]);

// /**
//  * Pushing New Value
//  * in the Database Object
//  */
// ref.push({
//     // id: 1,
//     movieThumb:{
//         full: 'https://i.ibb.co/fkyW2ZW/dc4b30cfa998.png',
//         thumb: 'https://i.ibb.co/7nZDXBD/dc4b30cfa998.png',
//         medium: 'https://i.ibb.co/F5y1Kc1/dc4b30cfa998.png'
//     },
//     title: "Dị Năng – Trong Mỗi Chúng Ta – Freaks – You are One of Us",
//     description: `Được kẻ lang thang bí ẩn mách bảo, nữ đầu bếp nhu mì làm đồ chiên rán biết cô có siêu năng lực và còn rất nhiều người giống cô. Đồng thời cô cũng phát hiện âm mưu xấ
//     u xa có quy mô lớn.Freaks – You’re One of Usdi nang trong moi chung ta`,
//     trial: "https://www.youtube.com/watch?v=kfZJhAWLMC4",
//     movieId: "xxx"
// });

// /**
//  * Reading Value from
//  * Firebase Data Object
//  */
// ref.once("value", function (snapshot) {
//   var data = snapshot.val(); //Data is in JSON format.
//   console.log(data);
// });
