-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for auth_db
DROP DATABASE IF EXISTS `auth_db`;
CREATE DATABASE IF NOT EXISTS `auth_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `auth_db`;

-- Dumping structure for table auth_db.reservations
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `film_title` varchar(255) NOT NULL,
  `broj_karata` int(11) NOT NULL,
  `datum` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table auth_db.reservations: ~3 rows (approximately)
DELETE FROM `reservations`;
INSERT INTO `reservations` (`id`, `username`, `email`, `film_title`, `broj_karata`, `datum`, `created_at`) VALUES
	(1, 'dejan', 'Deki@spid.com', 'Bridžet Džouns: Luda za njim', 2, '2025-03-21', '2025-03-19 20:47:51'),
	(2, 'biljin sin', 'kurac@gmail.com', 'Izolacija', 3, '2025-03-21', '2025-03-19 20:49:36'),
	(3, 'biljin sin', 'kurac@gmail.com', 'Led Zeppelin', 2, '2025-03-23', '2025-03-19 20:49:36'),
	(4, 'dejan', 'Deki@spid.com', 'Bratstvo lopova 2: Panter', 1, '2025-03-13', '2025-03-19 20:56:50');

-- Dumping structure for table auth_db.reviews
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filmId` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table auth_db.reviews: ~7 rows (approximately)
DELETE FROM `reviews`;
INSERT INTO `reviews` (`id`, `filmId`, `username`, `email`, `rating`, `comment`) VALUES
	(1, 1, 'dejan', 'Deki@spid.com', 5, 'gfddfg'),
	(2, 1, 'dejan', 'Deki@spid.com', 3, 'DEJANMEEEEEEEEEEEE'),
	(3, 1, 'dejan', 'Deki@spid.com', 5, 'asdasd'),
	(4, 1, 'dejan', 'Deki@spid.com', 5, 'asd'),
	(17, 6, 'dejan', 'Deki@spid.com', 3, 'moleraj'),
	(50, 2, 'dejan', 'Deki@spid.com', 5, 'asda'),
	(51, 3, 'dejan', 'Deki@spid.com', 5, 'dfsdf');

-- Dumping structure for table auth_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table auth_db.users: ~3 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
	(1, 'Test User', 'test@example.com', '$2a$10$5JfG5Yfs.9n3Mk9KMKavzuTYMDRD.3PViqL/7hCUprZswgUOczqMi'),
	(2, '1234', '12345@gmail.com', '$2b$10$xpL/u9TdyAeoWoOCfze6l.X/8d5pcIyHmsB0pBQIe8NUT/B1k7fby'),
	(3, 'Djole', 'Djole@gmail.com', '$2b$10$W9haXWmXZL8CK/ZOXP2VI.EWRwGw42iwoRYoYHEPRVwgeryvfCo.C'),
	(4, 'dejan', 'Deki@spid.com', '$2b$10$Nk.BUNnv1jUBdjz4o51.3eaGNQgGcz.2ynicU3OoDoj15WdVfTW7K'),
	(5, 'biljin sin', 'kurac@gmail.com', '$2b$10$J/zh9mZQ1jR8CM9lw9aho.rHwPEYQ9Ht6JZ1HdEY.2ieaSm6FOur2');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
