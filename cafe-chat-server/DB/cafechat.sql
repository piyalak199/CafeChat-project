-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:8080
-- Generation Time: Aug 14, 2024 at 12:54 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

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

-- --------------------------------------------------------

--
-- Table structure for table `impolite_word`
--

CREATE TABLE `impolite_word` (
  `wordID` int(5) NOT NULL,
  `word` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

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
(1, 'Cat', 'cat.png'),
(2, 'dog', 'dog.png'),
(3, 'rabbit', 'rabbit.png'),
(4, 'fish', 'fish.png');

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
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(6) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `displayName` varchar(10) NOT NULL,
  `coin` int(5) NOT NULL,
  `petTypeID` int(6) NOT NULL,
  `roleID` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `username`, `password`, `displayName`, `coin`, `petTypeID`, `roleID`) VALUES
(1, 'piyalak', '1bbd886460827015e5d605ed44252251', 'bua', 50, 1, 1),
(2, 'juthatip', 'bae5e3208a3c700e3db642b6631e95b9', 'mei', 40, 2, 1),
(3, 'one', '2be9bd7a3434f7038ca27d1918de58bd', 'day', 19, 2, 1),
(4, 'admin', 'admin001', '-', 0, 0, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_cloth`
--

CREATE TABLE `user_cloth` (
  `UclothID` int(5) NOT NULL,
  `userID` int(6) NOT NULL,
  `hatID` int(5) NOT NULL,
  `hat_active` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

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
-- Indexes for table `impolite_word`
--
ALTER TABLE `impolite_word`
  ADD PRIMARY KEY (`wordID`);

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
  MODIFY `roomID` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cloth`
--
ALTER TABLE `cloth`
  MODIFY `clothID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hat`
--
ALTER TABLE `hat`
  MODIFY `hatID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `impolite_word`
--
ALTER TABLE `impolite_word`
  MODIFY `wordID` int(5) NOT NULL AUTO_INCREMENT;

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
  MODIFY `TCoinID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_cloth`
--
ALTER TABLE `user_cloth`
  MODIFY `UclothID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_hat`
--
ALTER TABLE `user_hat`
  MODIFY `UhatID` int(5) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
