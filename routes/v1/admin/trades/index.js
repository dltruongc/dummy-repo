const express = require('express');

const tradesManagementController = require('../../../../controllers/admin/trades/trades.controllers');

const router = express.Router();

// http://localhost:8080/admin/trades/{tradeId}
router
  .route('/:tradeId')
  .get(tradesManagementController.showTradingHistoryDetail);

// http://localhost:8080/admin/trades
router.route('/').get(tradesManagementController.showTradingHistoriesList);

// http://localhost:8080/admin/trades/confirmation/confirm
router
  .route('/confirmation/confirm')
  .post(tradesManagementController.confirmTrade);

// http://localhost:8080/admin/trades/confirmation/cancel
router
  .route('/confirmation/cancel')
  .post(tradesManagementController.cancelTrade);

module.exports = router;
