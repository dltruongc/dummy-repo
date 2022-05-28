require('dotenv').config()
const express = require('express')
const { check, validationResult } = require('express-validator')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mysql = require('./db')
const bcrypt = require('bcrypt')
const fs = require('fs')
const fileReader = require('./fileReader')
const multer = require('multer')
const randomstring = require('randomstring')
const nodemailer = require('nodemailer')

const app = express()

const password = randomstring.generate(6)
const username = randomstring.generate({
  length: 10,
  charset: 'octal',
})

console.log(username)
console.log(password)

// app.get('/', (req, res) => {
//     res.render('index', { text: 'Hey' })
// })

// app.get('/index', (req, res) => {
//     res.render('index', { text: 'Hey' })
// })

// app.get('/login', (req, res) => {
//     res.render('login')
// })

// app.get('/register', (req, res) => {
//     res.render('register')
// })

app.get('/accountbalance', (req, res) => {
  res.render('accountbalance')
})

app.get('/linkcard', (req, res) => {
  res.render('linkcard')
})

app.get('/topup', (req, res) => {
  res.render('topup')
})

app.get('/transfer', (req, res) => {
  res.render('transfer')
})

app.get('/withdraw', (req, res) => {
  res.render('withdraw')
})

app.get('/buycard', (req, res) => {
  res.render('buycard')
})

app.get('/buybusticket', (req, res) => {
  res.render('buybusticket')
})

app.get('/profile', (req, res) => {
  res.render('profile')
})

app.use((req, res, next) => {
  req.vars = { root: __dirname }
  next()
})

const getDir = (req, res, next) => {
  if (!req.session.user) {
    return next()
  } else {
    const { userRoot } = req.session.user
    let { dir } = req.query
    if (dir == 'underfined') {
      dir = ''
    }
    let currentDir = `${userRoot}/${dir}`
    if (!fs.existsSync(currentDir)) {
      currentDir = userRoot
    }

    req.vars.currentDir = currentDir
    req.vars.userRoot = userRoot
    next()
  }
}
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('lnkd'))
app.use(flash())

const uploader = multer({ dest: __dirname + '/uploads/' })

app.use(
  session({
    secret: 'lnkd',
    resave: false,
    saveUninitialized: false,
  })
)

const registerValidator = [
  check('name').notEmpty().withMessage('Vui lòng nhập tên'),

  check('email')
    .notEmpty()
    .withMessage('Vui lòng nhập email')
    .isEmail()
    .withMessage('Email không hợp lệ'),

  // check("password")
  // .notEmpty()
  // .withMessage("Vui lòng nhập mật khẩu")
  // .isLength({ min: 6 })
  // .withMessage("Mật khẩu ít nhất 6 ký tự"),

  // check("confirm-password")
  // .notEmpty()
  // .withMessage("Vui lòng xác nhận mật khẩu")
  // .custom((value, { req }) => {
  //     if (value != req.body.password) {
  //         throw new Error("Mật khẩu không trùng khớp");
  //     } else {
  //         return true;
  //     }
  // }),
]
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyenvandiemhcmue@gmail.com',
    pass: 'Nvd09012001',
  },
})

const loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Vui lòng nhập email')
    .isEmail()
    .withMessage('Email không hợp lệ'),

  check('password')
    .notEmpty()
    .withMessage('Vui lòng nhập mật khẩu')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu ít nhất 6 ký tự'),
]

app.get('/', getDir, (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  let { userRoot, currentDir } = req.vars

  fileReader.load(userRoot, currentDir).then((files) => {
    const user = req.session.user
    res.render('index', { user, files })
  })
})

app.get('/login', (req, res) => {
  let error = req.flash('error')
  let email = req.flash('email') || ''
  let password = ''
  res.render('login', { error, email, password })
})

app.post('/login', loginValidator, (req, res) => {
  const result = validationResult(req)

  if (result.errors.length > 0) {
    const { email } = req.body
    req.flash('error', result.errors[0].msg)

    req.flash('email', email)
    res.redirect('/login')
  } else {
    const { email, password } = req.body

    const query = 'select * from account where email = ?'
    const params = [email]

    mysql.query(query, params, (err, result, fields) => {
      if (err) {
        throw err
      } else if (result.length == 0) {
        req.flash('error', 'Email không tồn tại')
        req.flash('email', email)
        return res.redirect('/login')
      } else {
        const passwordHash = result[0].password
        const checkPassword = bcrypt.compareSync(password, passwordHash)
        if (!checkPassword) {
          req.flash('error', 'Sai email hoặc mật khẩu')
          req.flash('email', email)
          return res.redirect('/login')
        } else {
          //login success
          let user = result[0]
          user.userRoot = `${req.vars.root}/users/${user.email}`
          req.session.user = user

          req.app.use(express.static(user.userRoot))

          return res.redirect('/')
        }
      }
    })
  }
})

app.get('/register', (req, res) => {
  let error = req.flash('error')
  let name = req.flash('name') || ''
  let email = req.flash('email') || ''
  let tel = req.flash('tel') || ''
  let birth = req.flash('birth') || ''
  let address = req.flash('address') || ''
  let fontid = req.flash('fontid') || ''
  let backid = req.flash('backid') || ''
  res.render('register', { error, name, email, tel, birth, address })
})

app.post('/register', registerValidator, (req, res) => {
  const result = validationResult(req)

  if (result.errors.length > 0) {
    const { name, email, tel, birth, address } = req.body
    req.flash('error', result.errors[0].msg)
    req.flash('name', name)
    req.flash('email', email)
    req.flash('tel', tel)
    req.flash('birth', birth)
    req.flash('address', address)
    res.redirect('/register')
  } else {
    var mailOptions = {
      from: '"Ví điện tử TDTUPay" nguyenvandiemhcmue@gmail.com',
      to: 'nguyenvandiemhcmus@gmail.com',
      subject: 'Xác thực tạo tài khoản ví điện tử DemoPay thành công',
      text: `Bạn đã tạo tài khoản ví điện tử DemoPay thành công\n Thông tin tìa khoản của bạn:\n Username:${username}}\n Password: ${password}\n Xin vui lòng thay đổi mật khẩu để đảm bảo an toàn cho tài khoản của mình.\n DemoPay chân thành cảm ơn bạn đã đồng hành cùng chúng tôi\n Chúc bạn có những trải nghiệm tốt nhất.`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    const { name, email, tel, birth, address, fontid, backid } = req.body

    const passwordHash = bcrypt.hashSync(password, 10)

    const query =
      'insert into account (username, password, name, email, tel, birth, address, fontid, backid) value(?, ?, ?, ?, ?, ?, ?, ?, ?)'

    const params = [
      username,
      passwordHash,
      name,
      email,
      tel,
      birth,
      address,
      fontid,
      backid,
    ]

    mysql.query(query, params, (err, result, fields) => {
      if (err) {
        const messageError =
          "ER_DUP_ENTRY: Duplicate entry '" + email + "' for key 'PRIMARY'"
        if (err.message == messageError) {
          req.flash('error', 'Email đã được sử dụng!')
          req.flash('name', name)
          req.flash('email', email)
          req.flash('tel', tel)
          req.flash('birth', birth)
          req.flash('address', address)
        } else {
          throw err
        }

        return res.redirect('/register')
      } else if (result.affectedRows == 1) {
        const { root } = req.vars
        const userDir = `${root}/users/${email}`

        fs.mkdir(userDir, () => {
          return res.redirect('/login')
        })
      } else {
        req.flash('error', result.message)
        req.flash('name', name)
        req.flash('email', email)
        req.flash('tel', tel)
        req.flash('birth', birth)
        req.flash('address', address)
        return res.redirect('/register')
      }
    })
  }
})

app.post('/upload', uploader.single('customFile'), (req, res) => {
  const { email, path } = req.body
  const file = req.file
  console.log(req.body)

  if (!email || !path || !file) {
    return res.json({ code: 1, message: 'Thiếu thông tin' })
  }

  const { root } = req.vars
  const currentPath = `${root}/users/${email}/${path}`

  if (!fs.existsSync(currentPath)) {
    return res.json({ code: 2, message: 'Đường dẫn không tồn tại' })
  }

  let name = file.originalname
  let filePath = `${currentPath}/${name}`

  fs.renameSync(file.path, filePath)

  return res.json({ code: 0, message: 'Upload thành công' })
})

app.post('/edit', uploader.single('customFile'), (req, res) => {
  const { email, oldName, newName } = req.body
  console.log(req.body)

  if (!email || !oldName || !newName) {
    return res.json({ code: 1, message: 'Thiếu thông tin' })
  }

  const { root } = req.vars
  const currentPath = `${root}/users/${email}/${oldName}`

  if (!fs.existsSync(currentPath)) {
    return res.json({ code: 2, message: 'Đường dẫn không tồn tại' })
  }

  let newPath = `${root}/users/${email}/${newName}`
  console.log('new: ' + newPath)
  fs.renameSync(currentPath, newPath)

  return res.json({ code: 0, message: 'Đổi tên thành công' })
})

app.post('/delete', uploader.single('customFile'), (req, res) => {
  const { email, name } = req.body
  console.log(req.body)

  if (!email || !name) {
    return res.json({ code: 1, message: 'Thiếu thông tin' })
  }

  const { root } = req.vars
  const currentPath = `${root}/users/${email}/${name}`

  if (!fs.existsSync(currentPath)) {
    return res.json({ code: 2, message: 'Đường dẫn không tồn tại' })
  }

  fs.unlinkSync(currentPath)

  return res.json({ code: 0, message: 'Xóa thành công' })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(
    `Server started on http://localhost:${port}; ` +
      `press Ctrl-C to terminate. `
  )
})
