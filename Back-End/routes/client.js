const { hashSync, genSaltSync } = require('bcrypt');
const express = require('express');
const client = require('../services/client');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

router.get('/all', async(req, res, next) =>{
    res.json(await client.getAll(req.body));
});

router.get('/name', async(req, res, next) =>{
    res.json(await client.getUserName(req.body));
    
});

router.get('/info', async(req, res, next) =>{
    res.json(await client.getUserInfo(req.body));
})

router.post('/login', async(req, res, next) =>{
    res.json(await client.login(req.body));
})

router.get('/pass', async(req, res, next) =>{
    res.json(await client.getUserpassword(req.body));
})

router.post('/compare', async(req, res, next) =>{
    res.json(await client.compare(req.body));
})

const Userfile = multer.diskStorage({
    destination: (req, file, cb) =>{
      cb(null, "./images");
    },
    filename: (req, file, cb) =>{
        console.log(req.body.nom);
      const filename = req.body.nom + '_' +file.originalname;
      cb(null, filename);
    }
  });

  const upload = multer({storage: Userfile});
  function getFileFromPath(filePath) {
    const dirname = path.dirname(__dirname);
    const absolutePath = path.join(dirname, filePath);
    console.log(absolutePath);
    console.log(path.dirname(__dirname));
    try {
      if (fs.existsSync(absolutePath)) {
        const fileContent = fs.readFileSync(absolutePath);
        return fileContent;
      } else {
        return null; // Le fichier n'existe pas
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération du fichier :', error);
      return null;
    }
  }
 

  router.post('/upload', upload.single('image'), async (req, res, next) =>{
    const filePath = req.file.path;
    const fileContent = getFileFromPath(filePath);
    
    if (fileContent) {
      console.log('Contenu du fichier :', fileContent);
    } else {
      console.log('Le fichier n\'existe pas ou une erreur s\'est produite lors de sa récupération.');
    }
    res.send(filePath);
    //res.json(await req.body.nom);
  })

router.post('/add',async (req, res, next) =>{
    // const salt = genSaltSync(10);
    // req.body.nom = hashSync(req.body.mdp, salt);
    res.json(await client.ajoutClient(req.body));
})

module.exports = router;