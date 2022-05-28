-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2022 at 03:22 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lab6-7`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `username` varchar(10) not null,
  `password` varchar(6) not null,
  `name` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `tel` varchar(10) NOT NULL,
  `birth` date NOT NULL,
  `address` varchar(200) NOT NULL,
  `fontid` varchar(50),
  `backid` varchar(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account`
--

SET DATE FORMAT DD/MM/YYY
INSERT INTO `account` (`id`, `username`, `password`, `name`, `email`, `tel`, `birth`, `address`, `fontid`, `backid`) VALUES
(0,'admin','$2b$10$88g0vPo7ugnaSzzOPuThQ.BSCBt5QrXWO9suluKFgnS588YAYgG8G','Nguyễn Văn Điểm', 'nguyenvandiemhcmus@icloud.com','0868084080','09/01/2001','TP Hồ Chí Minh','abcd1234567890','acb1234567890');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
