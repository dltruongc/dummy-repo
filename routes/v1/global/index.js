const express = require('express');

const getDir = require('../../../middleware/getdir.middleware');
const fileReader = require('../../../fileReader');

const router = express.Router();

const homeController = {
  show: (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    let { userRoot, currentDir } = req.vars;

    fileReader.load(userRoot, currentDir).then((files) => {
      const user = req.session.user;
      res.render('index', { user, files });
    });
  },
};

// entry point
// http://localhost:8080/
router.get('/', getDir, homeController.show);

module.exports = router;
