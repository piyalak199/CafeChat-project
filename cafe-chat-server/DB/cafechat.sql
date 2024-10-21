-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2024 at 01:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafechat`
--

-- --------------------------------------------------------

--
-- Table structure for table `chatroom`
--

CREATE TABLE `chatroom` (
  `roomID` int(2) NOT NULL,
  `quantity` int(2) NOT NULL,
  `limit` int(2) NOT NULL,
  `roomName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `chatroom`
--

INSERT INTO `chatroom` (`roomID`, `quantity`, `limit`, `roomName`) VALUES
(1, 0, 2, 'Cat_Room'),
(2, 0, 2, 'Dog_Room'),
(3, 0, 5, 'Rabbit_Room'),
(4, 0, 5, 'Fish_Room');

-- --------------------------------------------------------

--
-- Table structure for table `cloth`
--

CREATE TABLE `cloth` (
  `clothID` int(5) NOT NULL,
  `clothName` varchar(20) NOT NULL,
  `clothImg` varchar(100) NOT NULL,
  `clothCoin` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `cloth`
--

INSERT INTO `cloth` (`clothID`, `clothName`, `clothImg`, `clothCoin`) VALUES
(1, 'ชุดทหารเรือ', 'ชุดทหารเรือ.png', 25),
(2, 'ชุดโบว์', 'ชุดโบว์.png', 20),
(3, 'ชุดสีฟ้า', 'ชุดสีฟ้า.png', 15),
(4, 'ชุดเอี๊ยม', 'ชุดเอี๊ยม.png', 25),
(5, 'ชุดฮูดสีชมพู', 'ชุดฮูดสีชมพู.png', 20),
(6, 'ชุดขาว', 'ชุดขาว.png', 15);

-- --------------------------------------------------------

--
-- Table structure for table `hat`
--

CREATE TABLE `hat` (
  `hatID` int(5) NOT NULL,
  `hatName` varchar(20) NOT NULL,
  `hatImg` varchar(100) NOT NULL,
  `hatCoin` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `hat`
--

INSERT INTO `hat` (`hatID`, `hatName`, `hatImg`, `hatCoin`) VALUES
(1, 'blacktop', 'blacktop.png', 20),
(2, 'navy', 'navy.png', 25),
(3, 'pink', 'pink.png', 15);

-- --------------------------------------------------------

--
-- Table structure for table `impolite_word`
--
-- Error reading structure for table cafechat.impolite_word: #1932 - Table &#039;cafechat.impolite_word&#039; doesn&#039;t exist in engine
-- Error reading data for table cafechat.impolite_word: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `cafechat`.`impolite_word`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pettype`
--

CREATE TABLE `pettype` (
  `petTypeID` int(6) NOT NULL,
  `petName` varchar(50) NOT NULL,
  `petImg` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `pettype`
--

INSERT INTO `pettype` (`petTypeID`, `petName`, `petImg`) VALUES
(1, 'แมว', 'cat.png'),
(2, 'สุนัข', 'dog.png'),
(3, 'กระต่าย', 'rabbit.png'),
(4, 'ปลา', 'fish.png');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleID` int(2) NOT NULL,
  `roleName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleID`, `roleName`) VALUES
(1, 'user'),
(2, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_chat`
--

CREATE TABLE `transaction_chat` (
  `TChatNo` int(10) NOT NULL,
  `userID` int(6) NOT NULL,
  `roomID` int(2) NOT NULL,
  `dateTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `message` varchar(150) NOT NULL,
  `wordID` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `transaction_coin`
--

CREATE TABLE `transaction_coin` (
  `TCoinID` int(5) NOT NULL,
  `coinID` int(2) NOT NULL,
  `userID` int(6) NOT NULL,
  `recieptImg` varchar(100) NOT NULL,
  `status` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `typecoin`
--

CREATE TABLE `typecoin` (
  `coinID` int(2) NOT NULL,
  `coin` int(4) NOT NULL,
  `price` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `typecoin`
--

INSERT INTO `typecoin` (`coinID`, `coin`, `price`) VALUES
(1, 20, 10),
(2, 50, 25),
(3, 90, 40),
(4, 125, 55),
(5, 160, 70),
(6, 210, 85);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(6) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `displayName` varchar(16) NOT NULL,
  `coin` int(5) NOT NULL,
  `petTypeID` int(6) NOT NULL,
  `roleID` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `username`, `password`, `displayName`, `coin`, `petTypeID`, `roleID`) VALUES
(1, 'piyalak', '1bbd886460827015e5d605ed44252251', 'หมาน้อย', 95, 1, 1),
(2, 'juthatip', 'bae5e3208a3c700e3db642b6631e95b9', 'ทาสแมว', 0, 4, 1),
(3, 'one', '81dc9bdb52d04dc20036dbd8313ed055', 'น้องปลาทอง', 10, 4, 1),
(9, 'we', '81dc9bdb52d04dc20036dbd8313ed055', 'we love dogs', 0, 1, 1),
(10, 'b', '25d55ad283aa400af464c76d713c07ad', 'bb', 0, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_cloth`
--

CREATE TABLE `user_cloth` (
  `UclothID` int(5) NOT NULL,
  `userID` int(6) NOT NULL,
  `clothID` int(5) NOT NULL,
  `cloth_active` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `user_cloth`
--

INSERT INTO `user_cloth` (`UclothID`, `userID`, `clothID`, `cloth_active`) VALUES
(1, 1, 1, 'n'),
(2, 1, 5, 'y'),
(4, 2, 4, 'y'),
(5, 3, 5, 'n'),
(7, 1, 4, 'n'),
(8, 2, 3, 'n'),
(9, 1, 3, 'n'),
(10, 1, 2, 'n'),
(11, 3, 1, 'y');

-- --------------------------------------------------------

--
-- Table structure for table `user_hat`
--

CREATE TABLE `user_hat` (
  `UhatID` int(5) NOT NULL,
  `userID` int(6) NOT NULL,
  `hatID` int(5) NOT NULL,
  `hat_active` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `user_hat`
--

INSERT INTO `user_hat` (`UhatID`, `userID`, `hatID`, `hat_active`) VALUES
(26, 2, 3, 'n'),
(27, 2, 2, 'y'),
(28, 3, 1, 'n'),
(32, 1, 1, 'n'),
(34, 1, 3, 'y'),
(35, 3, 2, 'y');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatroom`
--
ALTER TABLE `chatroom`
  ADD PRIMARY KEY (`roomID`);

--
-- Indexes for table `cloth`
--
ALTER TABLE `cloth`
  ADD PRIMARY KEY (`clothID`);

--
-- Indexes for table `hat`
--
ALTER TABLE `hat`
  ADD PRIMARY KEY (`hatID`);

--
-- Indexes for table `pettype`
--
ALTER TABLE `pettype`
  ADD PRIMARY KEY (`petTypeID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleID`);

--
-- Indexes for table `transaction_chat`
--
ALTER TABLE `transaction_chat`
  ADD PRIMARY KEY (`TChatNo`);

--
-- Indexes for table `transaction_coin`
--
ALTER TABLE `transaction_coin`
  ADD PRIMARY KEY (`TCoinID`);

--
-- Indexes for table `typecoin`
--
ALTER TABLE `typecoin`
  ADD PRIMARY KEY (`coinID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `user_cloth`
--
ALTER TABLE `user_cloth`
  ADD PRIMARY KEY (`UclothID`);

--
-- Indexes for table `user_hat`
--
ALTER TABLE `user_hat`
  ADD PRIMARY KEY (`UhatID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatroom`
--
ALTER TABLE `chatroom`
  MODIFY `roomID` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cloth`
--
ALTER TABLE `cloth`
  MODIFY `clothID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `hat`
--
ALTER TABLE `hat`
  MODIFY `hatID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pettype`
--
ALTER TABLE `pettype`
  MODIFY `petTypeID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleID` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaction_chat`
--
ALTER TABLE `transaction_chat`
  MODIFY `TChatNo` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction_coin`
--
ALTER TABLE `transaction_coin`
  MODIFY `TCoinID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `typecoin`
--
ALTER TABLE `typecoin`
  MODIFY `coinID` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_cloth`
--
ALTER TABLE `user_cloth`
  MODIFY `UclothID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_hat`
--
ALTER TABLE `user_hat`
  MODIFY `UhatID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
