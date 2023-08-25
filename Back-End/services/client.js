const db = require('./db');
const bcrypt = require('bcrypt');
const helper = require('../helper');
const session = require('express-session');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Configurer la session
/*(session({
    secret: '1544',
    resave: false,
    saveUninitialized: true
    
  }));*/




async function getAll(){
  const query = `SELECT * FROM utilisateur `;
  const rows = await db.query(query);
  const data = helper.emptyRows(rows);
  return data;
}

async function getUserInfo(client){
  const query = `SELECT * FROM utilisateur WHERE nom = ?`;
  const params = [client.nom];
  const result = await db.query(query,params);
  const data = helper.emptyRows(result);
  if (data[0] == null){
    let ms = 'User does not exist';
    return ms;
  }else{
    return data;
  }
  return data;
}

async function getUserName(client){
const query = `SELECT nom FROM utilisateur WHERE nom = ?`;
const params = [client.nom];
const result = await db.query(query,params);
const data = helper.emptyRows(result);
if (data[0] == null){
  let ms = 'User does not exist';
  return ms;
}else{
  return data;
}

}

async function getUserpassword(client){
const query = `SELECT mdp FROM utilisateur WHERE nom = ?`;
const params = [client.nom];
const result = await db.query(query,params);
const data = helper.emptyRows(result);
if (data[0] == null ){
  let ms = 'User does not exist';
  return ms;
}else{
  return data;
}

}

// async function ajoutClient(client) {
//   const query = `INSERT INTO client (name, surname, email, password, image) VALUES (?, ?, ?, ?, ?)`;
//   const params = [
//     client.name,
//     client.surname,
//     client.email || null,
//     client.password,
//     client.image || null
//   ];
//     const result = await db.query(query,params);
//     const data = helper.emptyRows(result);
//     return data;
// }

async function compare(client){
const query = `SELECT mdp FROM utilisateur WHERE nom = ?`;
const params = [client.nom];
const result = await db.query(query,params);
const data = helper.emptyRows(result);
const verif = await getUserName(client);
const pass = await getUserpassword(client);
const info = await getUserInfo(client);

if (data.length === 0) {
  return 'User does not exist';
}
// if (data[0] == null){
//   let ms = 'User does not exist';
//   return ms;
// }
const valid = await bcrypt.compare(client.mdp, data[0].mdp);
if ((verif[0].nom == client.nom && valid) || (verif[0].nom == client.nom && pass[0].mdp == client.mdp)) {
  const token = jwt.sign({nom:info[0].nom,id:info[0].id,mail:info[0].mail,profil:info[0].profil}, 'secret', {expiresIn: '5m'})
  return {
    message: 'Connected Successfuly',
    token: token
  };
}
  return 'E-mail or password incorrect';


}

async function login(client) {
  const query = `SELECT mdp FROM utilisateur WHERE nom = ?`;
  const params = [client.nom];
  const result = await db.query(query,params);
  const data = helper.emptyRows(result);
  const verif = await getUserName(client);
  const pass = await getUserpassword(client);
  const info = await getUserInfo(client);
  
  if (data.length === 0) {
    return 'User does not exist';
  }
  // if (data[0] == null){
  //   let ms = 'User does not exist';
  //   return ms;
  // }
  const valid = await bcrypt.compare(client.mdp, data[0].mdp);
  if ((verif[0].nom == client.nom && valid) || (verif[0].nom == client.nom && pass[0].mdp == client.mdp)) {
    const token = jwt.sign({nom:info[0].nom,id:info[0].id,mail:info[0].mail,profil:info[0].profil}, 'secret', {expiresIn: '5m'})
    return {
      message: 'Connected Successfuly',
      token: token
    };
  }
    return 'E-mail or password incorrect';
  
  

}

// async function UpdateUserInfo(client){
//   const query = `UPDATE TABLE utilisateur`
// }

// async function Upload(client){
//   const detail = ajoutClient(clinet);
//   const Userfile = multer.diskStorage({
//     destination: (req, file, cb) =>{
//       cb(null, "./images");
//     },
//     filename: (req, file, cb) =>{
//       const filename = detail[0].nom + file.originalname;
//       cb(null, filename);
//     }
//   });
//   const upload = multer({storage: Userfile})
// }

async function ajoutClient(client){
  const verif = await getUserInfo(client)
  if(verif[0].mail == client.mail){
    let ms= 'E-mail already exist';
    return ms;
  }
  else{
    const query = `INSERT INTO utilisateur(nom,prenom,profil,mdp,tel,mail,id_type) VALUES (?,?,?,?,?,?,1)`;
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(client.mdp, salt)
    const params = [
          client.nom,
          client.prenom,
          client.profil || null,
          hash,
          client.tel || null,
          client.mail || null
          
        ];
    const result = await db.query(query, params);
    const data = helper.emptyRows(result);
    let msg = 'Something went wrong during the insertion';
  
    if(result != null){
      msg = 'Data entered sucessfuly!'
      return msg;
    }
    return data;
  }
  
  }

module.exports = {
    getAll,
    getUserInfo,
    ajoutClient,
    login,
    getUserpassword,
    getUserName,
    compare
};