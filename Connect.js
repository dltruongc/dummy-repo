const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'ewallet',
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
  const sqltbuser =
    'CREATE TABLE User (id INT, tel varchar(10), email varchar(50), name nvarchar(50), dayOfBirth date, address nvarchar(200), frontIDcard varchar(50), backSideIDCard varchar(50), username varchar(10), password varchar(6), role varchar(1), accountBalance double)';
  con.query(sqltbuser, function (err, result) {
    if (err) throw err;
    console.log('Table User created');
  });

  const sqltbcredit =
    'CREATE TABLE CreditCardInfo (id INT, cardNumber varchar(6), expDate date, CVV varchar(3))';
  con.query(sqltbcredit, function (err, result) {
    if (err) throw err;
    console.log('Table CreditCardInfo created');
  });

  const sqltbhis =
    'CREATE TABLE TradingHistory (id INT, type varchar(1), quantity int, amountMoney double, time datetime, status nvarchar(200), tradingCode varchar(50), tradingFee double, massage nvarchar(256), phoneCardCode varchar(50), ticketCode varchar(50), username varchar(10), tel varchar(10))';
  con.query(sqltbhis, function (err, result) {
    if (err) throw err;
    console.log('Table TradingHistory created');
  });

  const sqltbaccountst =
    'CREATE TABLE AccountStatus (id INT, username varchar(10), tel varchar(10), accountStatus varchar(1), loginStatus varchar(1), message nvarchar(200))';
  con.query(sqltbaccountst, function (err, result) {
    if (err) throw err;
    console.log('Table AccountStatus created');
  });

  const sqlformat = 'SET DATEFORMAT DMY';
  const sql =
    "INSERT INTO User (id, tel, email, name, dayOfBirth, address, frontIDcard, backSideIDCard, username, password, role, accountBalance) VALUES (1, '0868084080', 'admin@gmail.com', n'Nguyễn Văn Điểm', '2001-01-09', n'19 Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, TP Hồ Chí Minh', '', '', 'admin', '123456', '1', 1000000000)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log('1 record inserted');
  });
});

process.on('SIGINT', () => {
  console.log('Disconnecting');
  con.destroy();
});
