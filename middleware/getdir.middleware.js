const fs = require('fs');

const getDir = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    const { userRoot } = req.session.user;
    let { dir } = req.query;
    if (dir == 'underfined') {
      dir = '';
    }
    let currentDir = `${userRoot}/${dir}`;
    if (!fs.existsSync(currentDir)) {
      currentDir = userRoot;
    }

    req.vars.currentDir = currentDir;
    req.vars.userRoot = userRoot;
    next();
  }
};

module.exports = getDir;
