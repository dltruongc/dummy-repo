-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 28, 2022 at 05:54 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ElectronicWallet`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
                         `id` int(11) NOT NULL,
                         `username` varchar(10) DEFAULT NULL,
                         `password` varchar(6) DEFAULT NULL,
                         `name` varchar(20) DEFAULT NULL,
                         `email` varchar(60) DEFAULT NULL,
                         `tel` varchar(10) DEFAULT NULL,
                         `birth` date DEFAULT NULL,
                         `address` varchar(200) DEFAULT NULL,
                         `fontid` varchar(50) DEFAULT NULL,
                         `backid` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `username`, `password`, `name`, `email`, `tel`, `birth`, `address`, `fontid`, `backid`) VALUES
  (0, '1234567890', '$2b$10', 'Nguyễn Văn Điểm', 'nguyenvandiem@gmail.com', '0868084080', '2001-01-09', 'HCM', 'abc12345', 'abc67890');

-- --------------------------------------------------------

--
-- Table structure for table `accountStatus`
--

-- accountStatus: 0 là chờ, 1 là đã xác thực, 2 là chờ cập nhật thông tin, 3 là không hợp lệ
-- loginStatus: 0 là đăng nhập bình thường, 1 là đăng nhập bất thường, 2 là khoá tài khoản

CREATE TABLE `accountStatus` (
                               `id` int(11) NOT NULL,
                               `username` varchar(10) DEFAULT NULL,
                               `tel` varchar(10) DEFAULT NULL,
                               `accountStatus` varchar(1) DEFAULT NULL,
                               `loginStatus` varchar(1) DEFAULT NULL,
                               `message` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accountStatus`
--

INSERT INTO `accountStatus` (`id`, `username`, `tel`, `accountStatus`, `loginStatus`, `message`) VALUES
  (1, '1234567890', '0868084080', '1', '0', '');

-- --------------------------------------------------------

--
-- Table structure for table `creditCardInfo`
--

CREATE TABLE `creditCardInfo` (
                                `id` int(11) NOT NULL,
                                `cardnumber` varchar(6) DEFAULT NULL,
                                `exp` date DEFAULT NULL,
                                `cvv` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `creditCardInfo`
--

INSERT INTO `creditCardInfo` (`id`, `cardnumber`, `exp`, `cvv`) VALUES
                                                                  (0, '111111', '2022-10-10', '411'),
                                                                  (1, '222222', '2022-11-11', '443'),
                                                                  (2, '333333', '2022-12-12', '577');

-- --------------------------------------------------------

--
-- Table structure for table `tradingHistory`
--

-- type: 0 là nộp tiền vào ví, 1 là rút tiền, 2 là thanh toán mua card đt, 3 là thanh toán mua vé xe, 4 là chuyển tiền
-- status: 0 là thành công, 1 là thất bại, 2 là chờ duyệt

CREATE TABLE `tradingHistory` (
                                `id` int(11) NOT NULL,
                                `username` varchar(10) DEFAULT NULL,
                                `tel` varchar(10) DEFAULT NULL,
                                `type` char(1) DEFAULT NULL,
                                `tradingCode` varchar(50) DEFAULT NULL,
                                `quantity` int(11) DEFAULT NULL,
                                `amountMoney` double DEFAULT NULL,
                                `tradingFee` double DEFAULT NULL,
                                `time` datetime DEFAULT NULL,
                                `status` varchar(1) DEFAULT NULL,
                                `message` varchar(200) DEFAULT NULL,
                                `phoneCardCode` varchar(10) DEFAULT NULL,
                                `ticketCode` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tradingHistory`
--

INSERT INTO `tradingHistory` (`id`, `username`, `tel`, `type`, `tradingCode`, `quantity`, `amountMoney`, `tradingFee`, `time`, `status`, `message`, `phoneCardCode`, `ticketCode`) VALUES
  (1, '1234567890', '0868084080', '0', '098651437', NULL, 10000000, 0, '2022-05-20 23:59:59', '0', 'Nạp tiền từ thẻ vào ví', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `accountStatus`
--
ALTER TABLE `accountStatus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `creditCardInfo`
--
ALTER TABLE `creditCardInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tradingHistory`
--
ALTER TABLE `tradingHistory`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accountStatus`
--
ALTER TABLE `accountStatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `creditCardInfo`
--
ALTER TABLE `creditCardInfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tradingHistory`
--
ALTER TABLE `tradingHistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

ALTER TABLE `account` ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `account` ADD `updatedAt` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE `accountStatus` ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `accountStatus` ADD `updatedAt` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE `creditCardInfo` ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `creditCardInfo` ADD `updatedAt` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE `tradingHistory` ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `tradingHistory` ADD `updatedAt` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;

CREATE TABLE `balance` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(10) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `balance` ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `balance` ADD `updatedAt` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;

-- receiverUsername: username của người nhận (người được chuyển tiền)
-- feeBearer: người chịu chi phí (0: người gửi, 1: người nhận)

ALTER TABLE `tradingHistory`
  ADD `receiverUsername` varchar(10) NULL,
  ADD `receiverPhone` varchar(10) NULL,
ADD `feeBearer` int NULL AFTER `receiverUsername`;
