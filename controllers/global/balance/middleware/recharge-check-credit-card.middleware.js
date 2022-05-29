const createHttpError = require('http-errors');

const creditCards = [
  // Không giới hạn số lần nạp và số tiền mỗi lần nạp.
  { cardnumber: '111111', exp: new Date('2022-10-10'), cvv: '411' },
  // Không giới hạn số lần nạp nhưng chỉ được nạp tối đa 1 triệu/lần
  { cardnumber: '222222', exp: new Date('2022-11-11'), cvv: '443' },
  // Khi nạp bằng thẻ này thì luôn nhận được thông báo là “thẻ hết tiền”
  { cardnumber: '333333', exp: new Date('2022-12-12'), cvv: '577' },
];

/**
 * Kiểm tra thông tin thẻ tồn tại, cvv và ngày hết hạn, hạn mức giao dịch thẻ
 */
module.exports = function rechargeCheckCreditCardMiddleware(req, res, next) {
  const { amount, cardnumber, cvv, exp } = req.body;

  const creditCardInfo = creditCards.find(
    (card) => card.cardnumber === cardnumber
  );

  if (!creditCardInfo)
    return next(
      createHttpError(404, 'Không tìm thấy thông tin thẻ tín dụng tương ứng')
    );

  if (creditCardInfo.exp < new Date())
    return next(createHttpError(400, 'Thẻ đã hết hạn'));

  if (
    Date.parse(exp) !== Date.parse(creditCardInfo.exp) ||
    cvv !== creditCardInfo.cvv
  )
    return next(
      createHttpError(
        400,
        'Thông tin thẻ tín dụng không chính xác. Vui lòng nhập lại.'
      )
    );

  if (cardnumber === '333333')
    return next(createHttpError(422, 'Thẻ hết tiền'));

  if (cardnumber === '222222' && amount > 10e5)
    return next(
      createHttpError(400, 'Hạn mức nạp tối đa của thẻ là 1 triệu đồng')
    );
  return next();
};
