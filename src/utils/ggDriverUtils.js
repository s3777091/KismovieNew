// const { google } = require("googleapis");
// const driver = google.drive("v3");
// //import private key
// const key = require("../config/private_key_1.json");
// const jwtTokenClient = async () => {
//   //retrieve JWT
//   const jwtToken = new google.auth.JWT(
//     key.client_email,
//     null,
//     key.private_key,
//     [
//       "https://www.googleapis.com/auth/drive",
//       "https://www.googleapis.com/auth/drive.file",
//       "https://www.googleapis.com/auth/drive.readonly",
//       "https://www.googleapis.com/auth/drive.metadata.readonly",
//       "https://www.googleapis.com/auth/drive.appdata",
//       "https://www.googleapis.com/auth/drive.metadata",
//       "https://www.googleapis.com/auth/drive.photos.readonly",
//     ],
//     null
//   );
//   jwtToken.authorize((authErr) => {
//     if (authErr) {
//       console.log("ERROR: ", authErr);
//       return;
//     } else {
//       console.log("Auth success");
//     }
//   });
//   return jwtToken;
// };

// const ggDriverUpload = async (
//   folderId,
//   localFile,
//   remoteFileName,
//   mimeType
// ) => {
//   const token = await jwtTokenClient();
//   const fileMetadata = {
//     name: remoteFileName,
//     parents: [folderId],
//   };
//   const fileSize = fs.statSync(localFile).size;
//   const media = {
//     // mimeType: "video/mp4",
//     mimeType,
//     body: fs.createReadStream(localFile),
//   };

//   const res = await driver.files.create(
//     {
//       auth: token,
//       resource: fileMetadata,
//       media,
//       fields: "id",
//     },
//     {
//       // Use the `onUploadProgress` event from Axios to track the
//       // number of bytes uploaded to this point.
//       onUploadProgress: (evt) => {
//         const progress = (evt.bytesRead / fileSize) * 100;
//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         process.stdout.write(`${Math.round(progress)}% complete`);
//       },
//     }
//   );
//   const fileId = res.data.id;
//   const resource = { role: "reader", type: "anyone" };
//   try {
//     await driver.permissions.create({
//       auth: token,
//       fileId,
//       resource,
//       fields: "id",
//     });
//     //TODO: Update link and info MV
//     let linkResult = `https://drive.google.com/file/d/${fileId}/view`;
//     console.log({ linkResult });
//   } catch (error) {
//     //TODO: catch error
//   }

//   return fileId;
// };
// const ggDriverListFile = async (folderId, pageSize) => {
//   const token = jwtTokenClient();
//   driver.files.list(
//     {
//       auth: token,
//       pageSize: pageSize || 20,
//       q: `'${folderId}' in parents and trashed=false`,
//       fields: "files(id, name, fileExtension, mimeType)",
//     },
//     (err, { data }) => {
//       if (err) {
//         return console.log(err.message);
//       }
//       const files = data.files;
//       if (files.length) {
//         files.map((file) => {
//           console.log(file);
//         });
//       } else {
//         console.log("No file found.");
//       }
//     }
//   );
// };

// module.exports = {
//   jwtTokenClient,
//   ggDriverUpload,
//   ggDriverListFile,
// };
