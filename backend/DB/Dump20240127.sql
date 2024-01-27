CREATE DATABASE  IF NOT EXISTS `vertera` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vertera`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: vertera
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `messageId` int unsigned NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `AttachToMsgFK_idx` (`messageId`),
  CONSTRAINT `AttachToMsgFK` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (1,1,'/files/1/a9348906971dfbcf2835f44359476277.png'),(2,6,'/files/3/67acaccb9df2de102d68196b4a0eef9c.jpg'),(81,120,'/files/2024-01-22/a01461cc04be5720c1aec4efe1533708.jpg'),(82,120,'/files/2024-01-22/4ad6f9d025c65e37d564cbd8136502ba.jpg'),(83,121,'/files/2024-01-22/a01461cc04be5720c1aec4efe1533708.jpg'),(84,121,'/files/2024-01-22/4ad6f9d025c65e37d564cbd8136502ba.jpg');
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int unsigned NOT NULL,
  `outerId` int NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `outerId_UNIQUE` (`outerId`),
  CONSTRAINT `ClientToUserFK` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,23,'hugo@razes.ru'),(4,24,'alexandr191261@yandex.ru');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameCode` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CountryToTranslationFK_idx` (`nameCode`),
  CONSTRAINT `CountryToTranslationFK` FOREIGN KEY (`nameCode`) REFERENCES `translations` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (3,'COUNTRY_5D68AC73CB08553D8DF7A4D1B4DC97A7'),(4,'COUNTRY_6D095FF6963E42901E8DB74D905548A3'),(2,'COUNTRY_7B880D1109031A03655B66ACD0C780FD'),(5,'COUNTRY_CD8019F57C74BDD3556858914C505ED5'),(1,'COUNTRY_DA68DD4FBC33438825D655343295525C');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameCode` varchar(512) NOT NULL,
  `individual` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`nameCode`),
  CONSTRAINT `DepartmentToTranslationFK` FOREIGN KEY (`nameCode`) REFERENCES `translations` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (2,'DEPARTMENT_00E6366DE7FF2B8FC1180C3C732D80BA',0),(3,'DEPARTMENT_1AFF8F579BDDD54765F6D5DA364B508E',0),(5,'DEPARTMENT_C830262C8B0BF3015EFC660B25CD026D',1);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `helper_departments`
--

DROP TABLE IF EXISTS `helper_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helper_departments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `helperId` int unsigned NOT NULL,
  `departmentId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `DepartmentToHelperFK_idx` (`helperId`),
  KEY `HelperToDepartmentFK_idx` (`departmentId`) /*!80000 INVISIBLE */,
  CONSTRAINT `DepartmentToHelperFK` FOREIGN KEY (`helperId`) REFERENCES `helpers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `HelperToDepartmentFK` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helper_departments`
--

LOCK TABLES `helper_departments` WRITE;
/*!40000 ALTER TABLE `helper_departments` DISABLE KEYS */;
INSERT INTO `helper_departments` VALUES (1,2,3),(3,3,2),(4,3,3),(5,5,5),(13,52,2),(14,53,2),(15,54,2),(18,57,3),(19,58,3),(20,59,3),(21,60,3),(22,55,2);
/*!40000 ALTER TABLE `helper_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `helper_job_titles`
--

DROP TABLE IF EXISTS `helper_job_titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helper_job_titles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameCode` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `JobTitleToTranslationFK_idx` (`nameCode`),
  CONSTRAINT `JobTitleToTranslationFK` FOREIGN KEY (`nameCode`) REFERENCES `translations` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helper_job_titles`
--

LOCK TABLES `helper_job_titles` WRITE;
/*!40000 ALTER TABLE `helper_job_titles` DISABLE KEYS */;
INSERT INTO `helper_job_titles` VALUES (1,'JOBTITLE_018D3A9B770D07CB1522BFBC49C17CAF'),(3,'JOBTITLE_D3EA4DDD8FADFEC6A6C129E7ADB8C609'),(2,'JOBTITLE_D5D256B6C64C7A6C438CCF90FD624B7F');
/*!40000 ALTER TABLE `helper_job_titles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `helpers`
--

DROP TABLE IF EXISTS `helpers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helpers` (
  `id` int unsigned NOT NULL,
  `jobTitleId` int NOT NULL,
  `startWorkDate` date DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `HelperToUserFK` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helpers`
--

LOCK TABLES `helpers` WRITE;
/*!40000 ALTER TABLE `helpers` DISABLE KEYS */;
INSERT INTO `helpers` VALUES (0,1,'2023-09-17','2023-09-17'),(2,2,'2023-11-06','2001-12-23'),(3,3,'2023-10-01','2003-09-01'),(5,2,'2023-09-17','2023-01-23'),(52,2,'2024-01-22','2000-12-05'),(53,2,'2024-01-22','2000-06-05'),(54,2,'2024-01-22','1999-06-05'),(55,2,'2024-01-22','1999-06-04'),(57,2,'2024-01-22','1999-06-05'),(58,2,'2024-01-22','2001-08-03'),(59,2,'2024-01-22','2001-08-03'),(60,2,'2024-01-22','2001-02-03');
/*!40000 ALTER TABLE `helpers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `senderId` int unsigned NOT NULL,
  `recieverId` int unsigned NOT NULL,
  `ticketId` int unsigned NOT NULL,
  `type` varchar(255) NOT NULL,
  `readed` tinyint(1) NOT NULL,
  `text` text NOT NULL,
  `date` datetime NOT NULL,
  `visibility` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `MsgToTicketFK_idx` (`ticketId`) /*!80000 INVISIBLE */,
  FULLTEXT KEY `TextSearch_idx` (`text`),
  CONSTRAINT `MsgToTicketFK` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,2,1,'message',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2021-10-20 23:00:00',1),(2,2,1,1,'message',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2021-10-20 23:05:00',1),(3,4,3,2,'message',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-11-20 23:02:00',1),(4,3,4,2,'message',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-11-20 23:06:00',1),(5,4,3,2,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-11-20 23:09:00',1),(6,1,3,3,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-11-20 23:19:00',1),(7,0,1,1,'reacton',1,'Оцените ответ','2021-10-20 23:07:00',1),(8,0,4,2,'helperChange',1,'Вашим вопросом занимается Алексей','2023-11-20 23:19:00',1),(70,1,3,17,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-12-10 00:09:04',1),(71,0,1,17,'system',0,'Вашим вопросом занимается Алексей ','2023-12-10 00:09:04',1),(72,0,1,18,'system',0,'Вашим вопросом занимается Алексей ','2023-12-10 00:09:04',1),(73,0,1,11,'system',0,'Вашим вопросом занимается Алексей ','2023-12-10 00:09:04',1),(84,1,2,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-04 20:55:36',1),(85,2,1,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-04 20:55:50',1),(86,2,1,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-04 20:57:16',1),(89,1,2,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-12 10:41:10',1),(90,1,2,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-12 10:45:23',1),(92,1,60,25,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:38:05',1),(93,0,1,25,'system',0,'Вашим вопросом занимается Данил','2024-01-22 10:38:05',1),(94,1,52,26,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:03',1),(95,0,1,26,'system',0,'Вашим вопросом занимается Иван','2024-01-22 10:39:03',1),(96,1,53,27,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:10',1),(97,0,1,27,'system',0,'Вашим вопросом занимается Дмитрий','2024-01-22 10:39:10',1),(98,1,54,28,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:14',1),(99,0,1,28,'system',0,'Вашим вопросом занимается Дмитрий','2024-01-22 10:39:14',1),(100,1,55,29,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:37',1),(101,0,1,29,'system',0,'Вашим вопросом занимается Матвей','2024-01-22 10:39:37',1),(102,1,2,30,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:38',1),(103,0,1,30,'system',0,'Вашим вопросом занимается Михаил','2024-01-22 10:39:38',1),(104,1,57,31,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:45',1),(105,0,1,31,'system',0,'Вашим вопросом занимается Праведнослав','2024-01-22 10:39:45',1),(106,1,58,32,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:46',1),(107,0,1,32,'system',0,'Вашим вопросом занимается Ирина','2024-01-22 10:39:46',1),(108,1,59,33,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:52',1),(109,0,1,33,'system',0,'Вашим вопросом занимается Татьяна','2024-01-22 10:39:52',1),(110,1,60,34,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:53',1),(111,0,1,34,'system',0,'Вашим вопросом занимается Данил','2024-01-22 10:39:53',1),(112,1,52,35,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:56',1),(113,0,1,35,'system',0,'Вашим вопросом занимается Иван','2024-01-22 10:39:56',1),(114,1,53,36,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:57',1),(115,0,1,36,'system',0,'Вашим вопросом занимается Дмитрий','2024-01-22 10:39:57',1),(116,1,54,37,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:40:00',1),(117,0,1,37,'system',0,'Вашим вопросом занимается Дмитрий','2024-01-22 10:40:00',1),(118,1,55,38,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:40:00',1),(119,0,1,38,'system',0,'Вашим вопросом занимается Матвей','2024-01-22 10:40:00',1),(120,52,1,26,'message',0,'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?','2024-01-22 11:00:27',1),(121,52,1,35,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 11:08:18',1),(124,0,1,17,'helperChange',0,'Вашим вопросом занимается Ирина','2024-01-22 11:59:28',1),(125,0,1,25,'helperChange',0,'Вашим вопросом занимается Ирина','2024-01-22 12:02:38',1),(126,55,1,38,'message',0,'test','2024-01-25 12:14:43',1),(127,1,55,38,'message',0,'test','2024-01-25 12:15:26',1),(128,0,1,38,'system',0,'Обращение разделено на 2 новых','2024-01-26 10:53:31',1);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subthemes`
--

DROP TABLE IF EXISTS `subthemes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subthemes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameCode` varchar(512) NOT NULL DEFAULT 'none',
  `themeId` int NOT NULL,
  `orderNum` smallint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SubThemeToThemeFK_idx` (`themeId`),
  KEY `SubThemeToTranslationFK_idx` (`nameCode`),
  CONSTRAINT `SubThemeToThemeFK` FOREIGN KEY (`themeId`) REFERENCES `themes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `SubThemeToTranslationFK` FOREIGN KEY (`nameCode`) REFERENCES `translations` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subthemes`
--

LOCK TABLES `subthemes` WRITE;
/*!40000 ALTER TABLE `subthemes` DISABLE KEYS */;
INSERT INTO `subthemes` VALUES (1,'SUBTHEME_3791FEF4A7B43F0667C784E1902F4DD5',1,1),(2,'SUBTHEME_2FFD3D019ADB436A53191D91B2EAD5C6',1,2),(3,'SUBTHEME_27D3D0063AC3B364A3C1C03E4D91C351',1,3),(4,'SUBTHEME_D4404F2C27BD3E74B7D6D46BE3982208',1,4),(5,'SUBTHEME_466892FF57D7BD14D44DB226CB43777B',1,5),(6,'SUBTHEME_195390D8958F2B5C58F5AE60A1F0A96D',1,6),(7,'SUBTHEME_DEDE99743C1EDDC0CD1DD53CEF647244',1,7),(8,'SUBTHEME_CDA6854D9A99F697F61C360E1B06DEC9',2,1),(9,'SUBTHEME_BE33DF748F61F3E933C8EF8140265A73',2,2),(10,'SUBTHEME_1AB4B35179E42D4C85792732A1F7A9F1',2,3),(11,'SUBTHEME_856951C4DDFE9DB4B92800C0A2DC0F2E',2,4),(12,'SUBTHEME_0094CBABD8BA081F99A65818F2842B32',3,1),(13,'SUBTHEME_CFF62E55D4CD5359C02688018B38E22E',3,2),(14,'SUBTHEME_B75EF765365340792F441E5A3D1954CE',3,3),(15,'SUBTHEME_3AD1866AD8BF44DE49E6E9ED2AD238BE',3,4),(16,'SUBTHEME_D433BFB31B8FB5A7121A732236D1E943',3,5),(17,'SUBTHEME_BCD38D13C693168BA9CCB12830746F75',3,6),(18,'SUBTHEME_9F893128CB81C871D8701DB6383FBF09',3,7),(19,'SUBTHEME_AE71CA092765E64CAD45D6E504E57888',3,8),(20,'SUBTHEME_82BA4F94DCEF41AE3F1B6010A97ADAF4',3,9),(21,'SUBTHEME_9B0A22554460A2D1F00A9CE733640DBB',4,1),(22,'SUBTHEME_CAE57665EC55742A1D80D9BBB7203551',4,2),(23,'SUBTHEME_F330B7610935D1415505529FD2E8704F',4,3),(24,'SUBTHEME_05BFDD79152E37FD099ECB8515E86923',4,4),(25,'SUBTHEME_1629C3DAB62AA9DDFE0E139E9D8534BA',5,1),(26,'SUBTHEME_6A9985B5567A85DEAF05D89AB1B4DAD6',5,2),(27,'SUBTHEME_6933ED63E4BE6E7416DCEC5E6FD47EB7',5,3),(28,'SUBTHEME_2C0C943306B7B8134D91AEDA3AC440EB',5,4),(29,'SUBTHEME_F75BD25198806C485AC7937DAAC59CE5',5,5),(30,'SUBTHEME_41E44D29CA57B3DCBCF861507AAD3D11',6,1),(31,'SUBTHEME_2F3CB3228C032D52338C6508C3946798',6,2),(32,'SUBTHEME_9A18545D2F01FE8FF450D2C1594BAF3A',6,3),(33,'SUBTHEME_EBC51780F5BB7D03E6BEF01D7DB2D377',6,4),(34,'SUBTHEME_BA8646B918511048A7ECC4102BDEAE9B',6,5),(35,'SUBTHEME_D2957B752D574C0FC1337F602C8EE9CE',6,6),(36,'SUBTHEME_B64BC46C5F9B878A84D52BCCC0F3F048',6,7),(37,'SUBTHEME_C48C34B64F9D543732BE24D52D4B0286',7,1),(38,'SUBTHEME_4FA586BC9999E3CC571CB5256E7CACFE',7,2),(39,'SUBTHEME_BFE65E656AC4B69828052BA0DF6F5393',7,3),(40,'SUBTHEME_7DB13BA1488118A5CF5288417ED6F7C4',7,4),(41,'SUBTHEME_F6266D55C8143A82E628DB1B2160B83A',7,5),(42,'SUBTHEME_BC102C098E5ADD9A1A38DC9A2D50B778',7,6),(43,'SUBTHEME_7C254E0A037011015A3D0DCF65EA8224',7,7),(44,'SUBTHEME_36553BE76B68C2E0216D110D69B248F5',7,8),(45,'SUBTHEME_E09BBE3DB9FF2672931946CE8A00E32D',8,1),(46,'SUBTHEME_95083C84EBDB452FFE465F8AFAFF1CDF',8,2),(47,'SUBTHEME_30AAECCFAD74E17E43D0069E3C686342',8,3),(48,'SUBTHEME_7FA72A154EFA8BBE2C6B26A80F94B690',8,4),(49,'SUBTHEME_73B9F4FE23FDA000CAC8AF69BF0F793A',8,5),(50,'SUBTHEME_5D599EA92F1ADF2ECC9E29ED08A14B9F',8,6),(51,'SUBTHEME_1872F37824438B45EEBA91A29C1F8CE3',9,1),(52,'SUBTHEME_7302DB94A9A9B0ECEF401908266F9FF6',9,2),(53,'SUBTHEME_B8EEF7D148D43BE9829E51BB2E9C04F7',9,3),(54,'SUBTHEME_09409BBB92115518E7FB968D2BD5370C',9,4),(55,'SUBTHEME_C3D2EB60ECC621066473D3F57E156F79',10,1),(56,'SUBTHEME_2DB0E2C93EC649B52FA744F784BCA9D7',10,2),(57,'SUBTHEME_5880754A7F37557387991A21F68FFD19',10,3),(58,'SUBTHEME_F364B6F5BEE237B2AF3D798CBBA58178',10,4),(59,'SUBTHEME_F0ABB7FFBD78CA49BDFA9EDE8D828759',10,5),(60,'SUBTHEME_D9E296D403363B8E28A83A49CBEDCE4B',11,1),(61,'SUBTHEME_532B3C1C4548CBC7AD08358F7EDCC3B3',11,2),(62,'SUBTHEME_09D6FCD707A52B03CAC70622BAAA969C',11,3),(63,'SUBTHEME_F178AF36EF770E7472E1BF3BA9A4F628',11,4),(64,'SUBTHEME_75ED71CAB0FCA5D6EFC5413067176EE8',12,1),(65,'SUBTHEME_6A34C9DDD2A387FEB3A2B741126F3B28',12,2),(66,'SUBTHEME_DF5EE7BB4A607B52AE356F1EC96AC4BB',12,3),(67,'SUBTHEME_00521848B6FDCE2DB2B6DE43AD8DF4C1',12,4),(68,'SUBTHEME_814E983A7A42311B40000316CD6FEA66',12,5),(69,'SUBTHEME_E86D2CDBD946D92B81FCA31CC316C51F',12,6),(70,'SUBTHEME_F5FBF9A28B69BEA951615C723C1B5814',13,1),(71,'SUBTHEME_1551AAD11A91FEE8CB86A619798F5802',13,2),(72,'SUBTHEME_8199F66DC6A0CF5238875AD93E3216A3',13,3),(73,'SUBTHEME_DAF14AD3D2A51FF595143EB11C6058CA',14,1),(74,'SUBTHEME_1FA7F8484D6740A5A6861BE059398C2A',15,1),(75,'SUBTHEME_73450E5BC0BF9FDD5DA8FCC983711948',16,1),(76,'SUBTHEME_9F4A994E4156B5B3C0F4E0A4297F929E',17,1),(77,'SUBTHEME_5F87183289F736EDD8C858F8E6F8AC5B',17,2),(78,'SUBTHEME_FC76E6FB2C7FB229E7A004DA31BB7614',17,3),(79,'SUBTHEME_08BC30B7560FB30D7C8706906D211911',17,4),(80,'SUBTHEME_32C9FA2A341E8A2242F539C547108CBD',17,5),(81,'SUBTHEME_4B0F821A9F01F151086F3ECE9463D3D9',17,6),(82,'SUBTHEME_C897E225C83FE39AD6FEDAAF3B000D18',18,1),(83,'SUBTHEME_4F085E17BB0F40A975F3340479F68DBF',18,2),(84,'SUBTHEME_DF145A7CB0E0E053C2CDC14D2ADA2C65',18,3),(85,'SUBTHEME_4DD085E409A74CDF15F95BAC32F6D739',18,4),(86,'SUBTHEME_57B07F24A750F423F43266BCC9EE9F95',18,5),(87,'SUBTHEME_5B344D5390826BBCD17E9C1E4420B571',18,6),(88,'SUBTHEME_DFDD3F844F1351790CE078D00E34BF9E',19,1),(89,'SUBTHEME_5DF5056C148DCDF0E0D160F706AE2A43',19,2),(90,'SUBTHEME_ED9F431D13C117D4C5CFF2034D214EDD',19,3),(91,'SUBTHEME_5CB1DFDF3B3F45575979842827ACC514',19,4),(92,'SUBTHEME_1B6FE7554739FBB467BEC2B73C9BE2BA',20,1),(93,'SUBTHEME_79C879A54F974EFAA7B545BA9DFFCEDA',20,2),(94,'SUBTHEME_03BCBA2234CA2F7BE1A4B72EF7BC5D84',20,3),(95,'SUBTHEME_631ACA7E6C1B50D33F281113053B1497',20,4),(96,'SUBTHEME_5E6E501687DB8A8A0FD85ECCF31AAC7D',20,5),(97,'SUBTHEME_37E89DD02724B49C20B1D466C3E51D20',21,1),(98,'SUBTHEME_81A0D424C89CE99616AB3C3F6EB1C74D',21,2),(99,'SUBTHEME_78BF8C1DE2666BBA06AD753197005202',21,3),(100,'SUBTHEME_1F09F9D3822379F893845DB02F7658C4',21,4),(101,'SUBTHEME_177511656D886BA7856EB83981CF6F02',21,5),(102,'SUBTHEME_232CA03AE0637D05C316595CBF640D2E',22,1),(103,'SUBTHEME_271CA31E7FCEDB52FFC276D808461A18',23,1);
/*!40000 ALTER TABLE `subthemes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theme_departments`
--

DROP TABLE IF EXISTS `theme_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme_departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subThemeId` int NOT NULL,
  `departmentId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `DepartmentToThemeFK_idx` (`subThemeId`),
  KEY `ThemeToDepartmentFK_idx` (`departmentId`),
  CONSTRAINT `DepartmentToThemeFK` FOREIGN KEY (`subThemeId`) REFERENCES `subthemes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ThemeToDepartmentFK` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme_departments`
--

LOCK TABLES `theme_departments` WRITE;
/*!40000 ALTER TABLE `theme_departments` DISABLE KEYS */;
INSERT INTO `theme_departments` VALUES (1,1,2),(2,2,2),(3,3,2),(4,4,2),(5,5,2),(6,6,2),(7,7,2),(8,8,2),(9,9,2),(10,10,2),(11,11,2),(12,12,2),(13,13,2),(14,14,2),(15,15,2),(16,16,2),(17,17,2),(18,18,2),(19,19,2),(20,20,2),(21,21,2),(22,22,2),(23,23,2),(24,24,2),(25,25,2),(26,26,3),(27,27,2),(28,28,2),(29,29,2),(31,30,2),(32,30,3),(34,31,2),(35,31,3),(37,32,2),(38,32,3),(40,33,2),(41,33,3),(43,34,2),(44,34,3),(46,35,2),(47,35,3),(49,36,2),(50,36,3),(51,37,2),(52,38,2),(53,39,2),(54,40,2),(56,41,2),(57,41,3),(59,42,2),(60,42,3),(61,43,2),(62,44,2),(63,45,2),(64,46,2),(65,47,2),(66,48,2),(67,49,2),(68,50,2),(69,51,2),(70,52,2),(71,53,2),(72,54,2),(73,55,2),(74,56,2),(75,57,2),(76,58,2),(77,59,2),(78,60,2),(79,61,2),(80,62,2),(81,63,2),(82,64,2),(83,65,3),(84,66,5),(85,67,2),(86,68,2),(87,69,2),(88,70,2),(89,71,2),(90,72,2),(91,73,2),(92,74,3),(93,75,3),(94,76,3),(95,77,3),(96,78,3),(97,79,2),(98,80,2),(99,81,2),(100,82,3),(101,83,3),(102,84,3),(103,85,3),(104,86,3),(105,87,3),(106,88,3),(107,89,3),(108,90,3),(109,91,3),(110,92,3),(111,92,2),(112,93,3),(113,94,3),(114,95,3),(115,96,3),(116,97,3),(117,98,3),(118,99,3),(119,100,3),(120,101,3),(121,102,3),(122,103,3);
/*!40000 ALTER TABLE `theme_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `themes`
--

DROP TABLE IF EXISTS `themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `themes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameCode` varchar(512) NOT NULL,
  `unitId` int NOT NULL,
  `orderNum` smallint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ThemeToUnitFK_idx` (`unitId`),
  KEY `ThemeToTranslationFK_idx` (`nameCode`),
  CONSTRAINT `ThemeToTranslationFK` FOREIGN KEY (`nameCode`) REFERENCES `translations` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `ThemeToUnitFK` FOREIGN KEY (`unitId`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `themes`
--

LOCK TABLES `themes` WRITE;
/*!40000 ALTER TABLE `themes` DISABLE KEYS */;
INSERT INTO `themes` VALUES (1,'THEME_EDB3F5C0C392DF7F86A0358270BDE0E0',1,1),(2,'THEME_D0C4D0A6021EDC13E8149B07BE2304F4',1,2),(3,'THEME_C00FAF9F4A096FBD1171E05FA51C00D7',1,3),(4,'THEME_85DD5017C62149565B909B1341A62EDB',1,4),(5,'THEME_3C2D2829736172255113FF2A2D16D2D5',1,5),(6,'THEME_5F7249CB662E88CC370B52273D873EC8',1,6),(7,'THEME_9322CD7D3A2CBCAEF4DF26D56272AA7B',1,7),(8,'THEME_6FC86E481C945C253298F5E8EDA1F7A2',1,8),(9,'THEME_0C63C3BC3483C71F249BE17C66AEA6FA',1,9),(10,'THEME_FDE95BC2F0C449D0E70C489215D8EBD9',1,10),(11,'THEME_51B1143794A571DE66866BEFC03A49F9',1,11),(12,'THEME_286EB35B8608DF561F9CBC460B85CCCC',1,12),(13,'THEME_2BB3E5D9E8F7BBFF2273F358E3F4542B',1,13),(14,'THEME_74AD89D3BCF2883654054BD2BC6BA62D',1,14),(15,'THEME_E54210E8790DFAA86ADD8A7499B81342',2,1),(16,'THEME_599F5335BC00A1A965AD812265112C78',2,2),(17,'THEME_DB9A04D8A5C3F8ECB78D92D9A5CCC307',2,3),(18,'THEME_56F572513B8C5C785BABF5959CF359FF',2,4),(19,'THEME_57326D97A62056551CA14BB256FD9189',2,5),(20,'THEME_1A7CA3DC597DB324319DB7B11C545808',2,6),(21,'THEME_87BD9A7DFA1FD029A003BB6BD2DE072C',2,7),(22,'THEME_18B7E833D77E8B0866831D122ED0A077',2,8),(23,'THEME_9B4B27D49326F87DA1493DC1A29FE749',2,9);
/*!40000 ALTER TABLE `themes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_statuses`
--

DROP TABLE IF EXISTS `ticket_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameCode` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TicketStatusToTranslationFK_idx` (`nameCode`),
  CONSTRAINT `TicketStatusToTranslationFK` FOREIGN KEY (`nameCode`) REFERENCES `translations` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_statuses`
--

LOCK TABLES `ticket_statuses` WRITE;
/*!40000 ALTER TABLE `ticket_statuses` DISABLE KEYS */;
INSERT INTO `ticket_statuses` VALUES (4,'TICKETSTATUS_08F55006CF2D6B8E04B9A6A6929DAD22'),(2,'TICKETSTATUS_1E9D7762BEDE1EE920BDB6FCFC6CF403'),(1,'TICKETSTATUS_7E7FC777A5840F50BA8E03A4B78ACA47'),(5,'TICKETSTATUS_9F8568BC05C18BBB6AD1F08E9E2FE940'),(3,'TICKETSTATUS_B9C8AB323A26E59E41F56A62E1B4E5D1');
/*!40000 ALTER TABLE `ticket_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int unsigned NOT NULL,
  `helperId` int unsigned NOT NULL,
  `assistantId` int unsigned DEFAULT NULL,
  `date` datetime NOT NULL,
  `title` varchar(128) NOT NULL DEFAULT 'Без названия',
  `unitId` int unsigned NOT NULL,
  `themeId` int unsigned NOT NULL,
  `subThemeId` int unsigned NOT NULL,
  `statusId` int unsigned NOT NULL,
  `reaction` tinyint DEFAULT NULL,
  `link` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `link_UNIQUE` (`link`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,2,NULL,'2021-10-20 00:00:00','Без названия',1,1,2,2,1,'6aefa941ba63e7aa593780d33ab4b0b5'),(2,4,3,NULL,'2023-11-20 00:00:00','Без названия',1,14,73,2,0,'ee0e4365a20d76a0457b4a2c1ece0be9'),(3,1,3,NULL,'2023-11-20 00:00:00','Без названия',2,20,92,1,NULL,'b5dd73ae6bb0569fd2402ca636e8a509'),(11,1,2,NULL,'2023-11-19 01:17:49','Без названия',1,6,31,2,NULL,'d9517fae658a56b4b4c5263f82253cf1'),(17,1,58,NULL,'2023-12-10 00:09:04','Без названия',1,8,45,3,NULL,'dc47f981b90139c954b480dd805754d5'),(18,1,3,NULL,'2023-12-10 00:19:04','Без названия',1,4,21,1,NULL,'d121f56e1c766be7e0e0882c49c32ebf'),(25,1,58,NULL,'2024-01-22 10:38:05','Без названия',1,6,30,3,NULL,'f68b7b3ddc772c27355fe2e4147f2210'),(26,1,52,NULL,'2024-01-22 10:39:03','Без названия',1,6,30,3,NULL,'f3f61458ad397556529882d4ba7658a8'),(27,1,53,NULL,'2024-01-22 10:39:10','Без названия',1,6,31,1,NULL,'4234f7dfb2d17975f3917d77dba54dae'),(28,1,54,NULL,'2024-01-22 10:39:14','Без названия',1,6,31,1,NULL,'14753d4d6cc6405e3fd4ac92db77c73b'),(29,1,55,NULL,'2024-01-22 10:39:37','Без названия',1,6,32,1,NULL,'ad7cac978e219272b140a2a23a3d9fa5'),(30,1,2,NULL,'2024-01-22 10:39:38','Без названия',1,6,32,1,NULL,'1ca9b76bab7504effb76f0d25b4b78db'),(31,1,57,NULL,'2024-01-22 10:39:45','Без названия',1,6,33,1,NULL,'14bba595f9d54ce29bd97736a69bd612'),(32,1,58,NULL,'2024-01-22 10:39:46','Без названия',1,6,33,3,NULL,'267f4aa2a4376df77b22f1c8d1c4af7c'),(33,1,59,NULL,'2024-01-22 10:39:52','Без названия',1,6,34,1,NULL,'fca957e49de28a92da5e228ada162728'),(34,1,60,NULL,'2024-01-22 10:39:53','Без названия',1,6,34,1,NULL,'31132fe7023c8455b78b7a215ab6b89b'),(35,1,52,NULL,'2024-01-22 10:39:56','Без названия',1,6,35,2,1,'c370e49aa507ac8f3c76085689426678'),(36,1,53,NULL,'2024-01-22 10:39:57','Без названия',1,6,35,1,NULL,'4bf494580b2b3f15a3b3b05caaabcf90'),(37,1,54,NULL,'2024-01-22 10:40:00','Без названия',1,6,36,1,NULL,'8715bc5e838bd321eed485027780b555'),(38,1,55,NULL,'2024-01-22 10:40:00','Без названия',1,6,36,2,NULL,'05902843491977296984c7ebcc3ba5ce');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets_log`
--

DROP TABLE IF EXISTS `tickets_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `type` varchar(45) NOT NULL,
  `ticketId` int NOT NULL,
  `initiatorId` int NOT NULL,
  `info` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets_log`
--

LOCK TABLES `tickets_log` WRITE;
/*!40000 ALTER TABLE `tickets_log` DISABLE KEYS */;
INSERT INTO `tickets_log` VALUES (1,'2024-01-25 12:14:43','msgSend',38,55,'Отправил сообщение'),(2,'2024-01-25 12:15:26','msgSend',38,1,'Отправил сообщение'),(3,'2024-01-26 10:53:31','msgSend',38,0,'Отправил сообщение'),(4,'2024-01-26 10:53:31','split',38,55,'Разделил'),(5,'2024-01-26 10:53:31','msgSend',39,0,'Отправил сообщение'),(6,'2024-01-26 10:53:31','splitCreate',39,55,'Создал (сплит)'),(7,'2024-01-26 10:53:31','helperAssign',39,0,'Назначен куратор'),(8,'2024-01-26 10:53:31','msgSend',39,1,'Отправил сообщение'),(9,'2024-01-26 10:53:31','msgSend',40,0,'Отправил сообщение'),(10,'2024-01-26 10:53:31','splitCreate',40,55,'Создал (сплит)'),(11,'2024-01-26 10:53:31','helperAssign',40,0,'Назначен куратор'),(12,'2024-01-26 10:53:31','msgSend',40,1,'Отправил сообщение'),(13,'2024-01-26 10:53:31','statusChange',38,0,'Закрыл');
/*!40000 ALTER TABLE `tickets_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `translations`
--

DROP TABLE IF EXISTS `translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  `code` varchar(512) NOT NULL,
  `ru` varchar(512) NOT NULL,
  `en` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`),
  UNIQUE KEY `en_UNIQUE` (`en`)
) ENGINE=InnoDB AUTO_INCREMENT=723 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translations`
--

LOCK TABLES `translations` WRITE;
/*!40000 ALTER TABLE `translations` DISABLE KEYS */;
INSERT INTO `translations` VALUES (556,'ticketStatus','TICKETSTATUS_7E7FC777A5840F50BA8E03A4B78ACA47','Новый',NULL),(557,'ticketStatus','TICKETSTATUS_1E9D7762BEDE1EE920BDB6FCFC6CF403','Закрыт',NULL),(558,'ticketStatus','TICKETSTATUS_B9C8AB323A26E59E41F56A62E1B4E5D1','В процессе',NULL),(559,'subTheme','SUBTHEME_3791FEF4A7B43F0667C784E1902F4DD5','Создание кошелька',NULL),(560,'subTheme','SUBTHEME_2FFD3D019ADB436A53191D91B2EAD5C6','Заявка на вывод токенов ',NULL),(561,'subTheme','SUBTHEME_27D3D0063AC3B364A3C1C03E4D91C351','Пополнение личного кабинета',NULL),(562,'subTheme','SUBTHEME_D4404F2C27BD3E74B7D6D46BE3982208','Оплата заказа токенами',NULL),(563,'subTheme','SUBTHEME_466892FF57D7BD14D44DB226CB43777B','Не пришли токены по акции',NULL),(564,'subTheme','SUBTHEME_195390D8958F2B5C58F5AE60A1F0A96D','Прочие вопросы',NULL),(565,'subTheme','SUBTHEME_DEDE99743C1EDDC0CD1DD53CEF647244','Пожелания и предложения',NULL),(566,'subTheme','SUBTHEME_CDA6854D9A99F697F61C360E1B06DEC9','Заявка на вывод средств',NULL),(567,'subTheme','SUBTHEME_BE33DF748F61F3E933C8EF8140265A73','Приобретение invest пакета',NULL),(568,'subTheme','SUBTHEME_1AB4B35179E42D4C85792732A1F7A9F1','Прочие вопросы',NULL),(569,'subTheme','SUBTHEME_856951C4DDFE9DB4B92800C0A2DC0F2E','Пожелания и предложения',NULL),(570,'subTheme','SUBTHEME_0094CBABD8BA081F99A65818F2842B32','Изменение данных профиля',NULL),(571,'subTheme','SUBTHEME_CFF62E55D4CD5359C02688018B38E22E','Проблемы с доступом',NULL),(572,'subTheme','SUBTHEME_B75EF765365340792F441E5A3D1954CE','Удаление личных данных',NULL),(573,'subTheme','SUBTHEME_3AD1866AD8BF44DE49E6E9ED2AD238BE','Переоформление/передача ID номера',NULL),(574,'subTheme','SUBTHEME_D433BFB31B8FB5A7121A732236D1E943','Подтверждение контактных данных',NULL),(575,'subTheme','SUBTHEME_BCD38D13C693168BA9CCB12830746F75','Изменение доверенного ЦО',NULL),(576,'subTheme','SUBTHEME_9F893128CB81C871D8701DB6383FBF09','Подтверждение Партнерского соглашения',NULL),(577,'subTheme','SUBTHEME_AE71CA092765E64CAD45D6E504E57888','Прочие вопросы',NULL),(578,'subTheme','SUBTHEME_82BA4F94DCEF41AE3F1B6010A97ADAF4','Пожелания и предложения',NULL),(579,'subTheme','SUBTHEME_9B0A22554460A2D1F00A9CE733640DBB','Выплата бонусов',NULL),(580,'subTheme','SUBTHEME_CAE57665EC55742A1D80D9BBB7203551','Начисление бонусов',NULL),(581,'subTheme','SUBTHEME_F330B7610935D1415505529FD2E8704F','Пожелания и предложения',NULL),(582,'subTheme','SUBTHEME_05BFDD79152E37FD099ECB8515E86923','Прочие вопросы',NULL),(583,'subTheme','SUBTHEME_1629C3DAB62AA9DDFE0E139E9D8534BA','Информация О Продукте',NULL),(584,'subTheme','SUBTHEME_6A9985B5567A85DEAF05D89AB1B4DAD6','Наличие Продукции',NULL),(585,'subTheme','SUBTHEME_6933ED63E4BE6E7416DCEC5E6FD47EB7','Контроль качества',NULL),(586,'subTheme','SUBTHEME_2C0C943306B7B8134D91AEDA3AC440EB','Прочие вопросы',NULL),(587,'subTheme','SUBTHEME_F75BD25198806C485AC7937DAAC59CE5','Пожелания и предложения',NULL),(588,'subTheme','SUBTHEME_41E44D29CA57B3DCBCF861507AAD3D11','Не верно указан адрес',NULL),(589,'subTheme','SUBTHEME_2F3CB3228C032D52338C6508C3946798','Изменить получателя',NULL),(590,'subTheme','SUBTHEME_9A18545D2F01FE8FF450D2C1594BAF3A','Заказ не получен',NULL),(591,'subTheme','SUBTHEME_EBC51780F5BB7D03E6BEF01D7DB2D377','Заказ пришел не в том объёме',NULL),(592,'subTheme','SUBTHEME_BA8646B918511048A7ECC4102BDEAE9B','Товар пришёл поврежденным',NULL),(593,'subTheme','SUBTHEME_D2957B752D574C0FC1337F602C8EE9CE','Прочие вопросы',NULL),(594,'subTheme','SUBTHEME_B64BC46C5F9B878A84D52BCCC0F3F048','Пожелания и предложения',NULL),(595,'subTheme','SUBTHEME_C48C34B64F9D543732BE24D52D4B0286','Не выбрал подарочный продукт',NULL),(596,'subTheme','SUBTHEME_4FA586BC9999E3CC571CB5256E7CACFE','Отмена заказа',NULL),(597,'subTheme','SUBTHEME_BFE65E656AC4B69828052BA0DF6F5393','Списать бонусы в счёт оплаты заказа',NULL),(598,'subTheme','SUBTHEME_7DB13BA1488118A5CF5288417ED6F7C4','Не проходит оплата',NULL),(599,'subTheme','SUBTHEME_F6266D55C8143A82E628DB1B2160B83A','Не верно указал адрес',NULL),(600,'subTheme','SUBTHEME_BC102C098E5ADD9A1A38DC9A2D50B778','Изменить получателя',NULL),(601,'subTheme','SUBTHEME_7C254E0A037011015A3D0DCF65EA8224','Прочие вопросы',NULL),(602,'subTheme','SUBTHEME_36553BE76B68C2E0216D110D69B248F5','Пожелания и предложения',NULL),(603,'subTheme','SUBTHEME_E09BBE3DB9FF2672931946CE8A00E32D','Консультация по условиям Акции',NULL),(604,'subTheme','SUBTHEME_95083C84EBDB452FFE465F8AFAFF1CDF','Не получил подарок по Акции',NULL),(605,'subTheme','SUBTHEME_30AAECCFAD74E17E43D0069E3C686342','Не пришли токены по акции',NULL),(606,'subTheme','SUBTHEME_7FA72A154EFA8BBE2C6B26A80F94B690','Путешествия',NULL),(607,'subTheme','SUBTHEME_73B9F4FE23FDA000CAC8AF69BF0F793A','Прочие вопросы',NULL),(608,'subTheme','SUBTHEME_5D599EA92F1ADF2ECC9E29ED08A14B9F','Пожелания и предложения',NULL),(609,'subTheme','SUBTHEME_1872F37824438B45EEBA91A29C1F8CE3','Вопрос по квалификации',NULL),(610,'subTheme','SUBTHEME_7302DB94A9A9B0ECEF401908266F9FF6','WR Club 200+',NULL),(611,'subTheme','SUBTHEME_B8EEF7D148D43BE9829E51BB2E9C04F7','Прочие вопросы',NULL),(612,'subTheme','SUBTHEME_09409BBB92115518E7FB968D2BD5370C','Пожелания и предложения',NULL),(613,'subTheme','SUBTHEME_C3D2EB60ECC621066473D3F57E156F79','Коррекция по бинару',NULL),(614,'subTheme','SUBTHEME_2DB0E2C93EC649B52FA744F784BCA9D7','Коррекция Наставника',NULL),(615,'subTheme','SUBTHEME_5880754A7F37557387991A21F68FFD19','Коррекция бинарного статуса',NULL),(616,'subTheme','SUBTHEME_F364B6F5BEE237B2AF3D798CBBA58178','Прочие вопросы',NULL),(617,'subTheme','SUBTHEME_F0ABB7FFBD78CA49BDFA9EDE8D828759','Пожелания и предложения',NULL),(618,'subTheme','SUBTHEME_D9E296D403363B8E28A83A49CBEDCE4B','Уточнение деталей',NULL),(619,'subTheme','SUBTHEME_532B3C1C4548CBC7AD08358F7EDCC3B3','Уведомление о системной ошибке',NULL),(620,'subTheme','SUBTHEME_09D6FCD707A52B03CAC70622BAAA969C','Прочие вопросы',NULL),(621,'subTheme','SUBTHEME_F178AF36EF770E7472E1BF3BA9A4F628','Пожелания и предложения',NULL),(622,'subTheme','SUBTHEME_75ED71CAB0FCA5D6EFC5413067176EE8','Вопросы по сайту',NULL),(623,'subTheme','SUBTHEME_6A34C9DDD2A387FEB3A2B741126F3B28','Открытие Центра Обслуживания',NULL),(624,'subTheme','SUBTHEME_DF5EE7BB4A607B52AE356F1EC96AC4BB','Международные Рынки',NULL),(625,'subTheme','SUBTHEME_00521848B6FDCE2DB2B6DE43AD8DF4C1','Этический кодекс',NULL),(626,'subTheme','SUBTHEME_814E983A7A42311B40000316CD6FEA66','Пожелания и предложения',NULL),(627,'subTheme','SUBTHEME_E86D2CDBD946D92B81FCA31CC316C51F','Прочие вопросы',NULL),(628,'subTheme','SUBTHEME_F5FBF9A28B69BEA951615C723C1B5814','Поиск Информации',NULL),(629,'subTheme','SUBTHEME_1551AAD11A91FEE8CB86A619798F5802','Пожелания и предложения',NULL),(630,'subTheme','SUBTHEME_8199F66DC6A0CF5238875AD93E3216A3','Прочие вопросы',NULL),(631,'subTheme','SUBTHEME_DAF14AD3D2A51FF595143EB11C6058CA','none',NULL),(632,'subTheme','SUBTHEME_1FA7F8484D6740A5A6861BE059398C2A','none',NULL),(633,'subTheme','SUBTHEME_73450E5BC0BF9FDD5DA8FCC983711948','none',NULL),(634,'subTheme','SUBTHEME_9F4A994E4156B5B3C0F4E0A4297F929E','Открыть продукты на ЦО',NULL),(635,'subTheme','SUBTHEME_5F87183289F736EDD8C858F8E6F8AC5B','Закрыть продукты на ЦО',NULL),(636,'subTheme','SUBTHEME_FC76E6FB2C7FB229E7A004DA31BB7614','Контроль качества',NULL),(637,'subTheme','SUBTHEME_08BC30B7560FB30D7C8706906D211911','Информация О Продукте',NULL),(638,'subTheme','SUBTHEME_32C9FA2A341E8A2242F539C547108CBD','Прочие вопросы',NULL),(639,'subTheme','SUBTHEME_4B0F821A9F01F151086F3ECE9463D3D9','Пожелания и предложения',NULL),(640,'subTheme','SUBTHEME_C897E225C83FE39AD6FEDAAF3B000D18','Выставление счёта',NULL),(641,'subTheme','SUBTHEME_4F085E17BB0F40A975F3340479F68DBF','Акты',NULL),(642,'subTheme','SUBTHEME_DF145A7CB0E0E053C2CDC14D2ADA2C65','Выплата дохода',NULL),(643,'subTheme','SUBTHEME_4DD085E409A74CDF15F95BAC32F6D739','Начисление дохода',NULL),(644,'subTheme','SUBTHEME_57B07F24A750F423F43266BCC9EE9F95','Пожелания и предложения',NULL),(645,'subTheme','SUBTHEME_5B344D5390826BBCD17E9C1E4420B571','Прочие вопросы',NULL),(646,'subTheme','SUBTHEME_DFDD3F844F1351790CE078D00E34BF9E','Наличие продукции',NULL),(647,'subTheme','SUBTHEME_5DF5056C148DCDF0E0D160F706AE2A43','Пересорт',NULL),(648,'subTheme','SUBTHEME_ED9F431D13C117D4C5CFF2034D214EDD','Прочие вопросы',NULL),(649,'subTheme','SUBTHEME_5CB1DFDF3B3F45575979842827ACC514','Пожелания и предложения',NULL),(650,'subTheme','SUBTHEME_1B6FE7554739FBB467BEC2B73C9BE2BA','Изменение состава заказа',NULL),(651,'subTheme','SUBTHEME_79C879A54F974EFAA7B545BA9DFFCEDA','Списание',NULL),(652,'subTheme','SUBTHEME_03BCBA2234CA2F7BE1A4B72EF7BC5D84','Прочие вопросы',NULL),(653,'subTheme','SUBTHEME_631ACA7E6C1B50D33F281113053B1497','Акт сверки',NULL),(654,'subTheme','SUBTHEME_5E6E501687DB8A8A0FD85ECCF31AAC7D','Инвентаризация',NULL),(655,'subTheme','SUBTHEME_37E89DD02724B49C20B1D466C3E51D20','Договор',NULL),(656,'subTheme','SUBTHEME_81A0D424C89CE99616AB3C3F6EB1C74D','Контакты',NULL),(657,'subTheme','SUBTHEME_78BF8C1DE2666BBA06AD753197005202','Товарные лимиты',NULL),(658,'subTheme','SUBTHEME_1F09F9D3822379F893845DB02F7658C4','Прочие вопросы',NULL),(659,'subTheme','SUBTHEME_177511656D886BA7856EB83981CF6F02','Пожелания и предложения',NULL),(660,'subTheme','SUBTHEME_232CA03AE0637D05C316595CBF640D2E','none',NULL),(661,'subTheme','SUBTHEME_271CA31E7FCEDB52FFC276D808461A18','none',NULL),(662,'theme','THEME_EDB3F5C0C392DF7F86A0358270BDE0E0','WRT Токены',NULL),(663,'theme','THEME_D0C4D0A6021EDC13E8149B07BE2304F4','Платформа D-INVEST',NULL),(664,'theme','THEME_C00FAF9F4A096FBD1171E05FA51C00D7','Личные данные',NULL),(665,'theme','THEME_85DD5017C62149565B909B1341A62EDB','Бонусные вознаграждения',NULL),(666,'theme','THEME_3C2D2829736172255113FF2A2D16D2D5','Вопросы по продукции',NULL),(667,'theme','THEME_5F7249CB662E88CC370B52273D873EC8','Доставка заказа (отправленный)',NULL),(668,'theme','THEME_9322CD7D3A2CBCAEF4DF26D56272AA7B','Изменение заказа (не отправленный)',NULL),(669,'theme','THEME_6FC86E481C945C253298F5E8EDA1F7A2','Акции',NULL),(670,'theme','THEME_0C63C3BC3483C71F249BE17C66AEA6FA','Признания достижений',NULL),(671,'theme','THEME_FDE95BC2F0C449D0E70C489215D8EBD9','Ошибка в структуре',NULL),(672,'theme','THEME_51B1143794A571DE66866BEFC03A49F9','Маркетинг план',NULL),(673,'theme','THEME_286EB35B8608DF561F9CBC460B85CCCC','Вопросы по ведению бизнеса',NULL),(674,'theme','THEME_2BB3E5D9E8F7BBFF2273F358E3F4542B','Общие вопросы о компании',NULL),(675,'theme','THEME_74AD89D3BCF2883654054BD2BC6BA62D','Прочие вопросы и предложения',NULL),(676,'theme','THEME_E54210E8790DFAA86ADD8A7499B81342','Открытие Центра Обслуживания',NULL),(677,'theme','THEME_599F5335BC00A1A965AD812265112C78','Оформление офиса',NULL),(678,'theme','THEME_DB9A04D8A5C3F8ECB78D92D9A5CCC307','Продукты',NULL),(679,'theme','THEME_56F572513B8C5C785BABF5959CF359FF','Финансы',NULL),(680,'theme','THEME_57326D97A62056551CA14BB256FD9189','Поставка',NULL),(681,'theme','THEME_1A7CA3DC597DB324319DB7B11C545808','Корректировка остатков',NULL),(682,'theme','THEME_87BD9A7DFA1FD029A003BB6BD2DE072C','Изменение данных',NULL),(683,'theme','THEME_18B7E833D77E8B0866831D122ED0A077','Закрытие офиса',NULL),(684,'theme','THEME_9B4B27D49326F87DA1493DC1A29FE749','Прочие вопросы и предложения',NULL),(685,'unit','UNIT_38F4B792367665ECAB510E7236BEB3E4','Партнерам/Клиентам',NULL),(686,'unit','UNIT_F91F5720E82A6C4D0257651298C590A9','Держателям офиса',NULL),(698,'department','DEPARTMENT_00E6366DE7FF2B8FC1180C3C732D80BA','Оперативная поддержка',NULL),(699,'department','DEPARTMENT_1AFF8F579BDDD54765F6D5DA364B508E','Поддержка ЦО',NULL),(701,'department','DEPARTMENT_C830262C8B0BF3015EFC660B25CD026D','Вершинин',NULL),(702,'jobTitle','JOBTITLE_018D3A9B770D07CB1522BFBC49C17CAF','Администратор',NULL),(703,'jobTitle','JOBTITLE_D5D256B6C64C7A6C438CCF90FD624B7F','Куратор',NULL),(704,'jobTitle','JOBTITLE_D3EA4DDD8FADFEC6A6C129E7ADB8C609','Руководитель',NULL),(709,'country','COUNTRY_DA68DD4FBC33438825D655343295525C','Россия',NULL),(710,'country','COUNTRY_7B880D1109031A03655B66ACD0C780FD','Африка',NULL),(711,'country','COUNTRY_5D68AC73CB08553D8DF7A4D1B4DC97A7','Польша',NULL),(712,'country','COUNTRY_6D095FF6963E42901E8DB74D905548A3','Китай',NULL),(713,'country','COUNTRY_CD8019F57C74BDD3556858914C505ED5','Япония',NULL),(721,'ticketStatus','TICKETSTATUS_08F55006CF2D6B8E04B9A6A6929DAD22','На уточнении',NULL),(722,'ticketStatus','TICKETSTATUS_9F8568BC05C18BBB6AD1F08E9E2FE940','Ожидает дополнения',NULL);
/*!40000 ALTER TABLE `translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameCode` varchar(512) NOT NULL,
  `orderNum` smallint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UnitToTranslation_idx` (`nameCode`),
  CONSTRAINT `UnitToTranslation` FOREIGN KEY (`nameCode`) REFERENCES `translations` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'UNIT_38F4B792367665ECAB510E7236BEB3E4',1),(2,'UNIT_F91F5720E82A6C4D0257651298C590A9',2);
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `patronymic` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `countryId` int unsigned NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `token` varchar(512) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_UNIQUE` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'VERTERA','Система',NULL,'system',1,'','admin','$2b$10$/ROlAMt.QF5wEkDPPAvWp.CMD1ULODFwizUZf.W0ideQPeao7a7tC','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwiaWF0IjoxNzAyNDQ1NjYwLCJleHAiOjE3MDI0NzQ0NjB9.D1rB0ShdEhxkzITO3MzvT9I2AM4KrO031WlW3Zvg1B4',1),(1,'Александр','Кутышкин','Александрович','client',1,'79786678688',NULL,NULL,NULL,1),(2,'Михаил','Гулевич','Константинович','helper',2,'387654678645','misha','$2b$10$MCosDCGkNJnIOQ8NdwRC4.CE7VDAoSnqxxakTwbuUVM1N6jbluxxi','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA2MDcwNTkyLCJleHAiOjE3MDYwOTkzOTJ9.AeQvH3oCzaKxhwQq-2M6YIDTougJIc23eiJZcotDATE',1),(3,'Алексей','Пинчук','Иванович','helper',3,'543345672132','lesha','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',NULL,1),(4,'Константин','Кувалдович',NULL,'client',4,'456575675','kuvalda','$2b$10$MCosDCGkNJnIOQ8NdwRC4.CE7VDAoSnqxxakTwbuUVM1N6jbluxxi','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzA2MDc1OTIyLCJleHAiOjE3MDYyNDg3MjJ9.kCB_dZ8lAm4gv8xP5_DllrNuRY_dPYAtvRAiwiQAz2I',1),(5,'Никита','Алексеев','Константинович','helper',5,'98728749384','nikita','$2b$10$RIB9SNmYE0QqA1rr8dgHHe4BDr5.qyKkK92rjEIMgntSCCZRHBGjO',NULL,1),(52,'Иван','Иванов','Иванович','helper',1,'7999999988','ivan','$2b$10$MCosDCGkNJnIOQ8NdwRC4.CE7VDAoSnqxxakTwbuUVM1N6jbluxxi','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTIsImlhdCI6MTcwNTk4NDkzMCwiZXhwIjoxNzA2MDEzNzMwfQ.slWEkDqv0hrlvNWlz0Jyo6KShOfgVRTL1QmVOG2xv_4',1),(53,'Дмитрий','Иванов','Иванович','helper',1,'7999999988','dima','$2b$10$8JDEM2DOreKzi2LPtnkFOOOwyQU/J4YYpl0D0SvfyAo5g0wt9uZnO',NULL,1),(54,'Дмитрий','Курский','Иванович','helper',1,'7999999988','kursk','$2b$10$VXMzed.ifdti.te0S4Uvj.vx5ToYAdMitanO5u9eOwGGeyqZs4Wie',NULL,1),(55,'Матвей','Клинков','Сергеевич','helper',1,'7999999988','matvei','$2b$10$MCosDCGkNJnIOQ8NdwRC4.CE7VDAoSnqxxakTwbuUVM1N6jbluxxi','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTUsImlhdCI6MTcwNjI0MTE3MiwiZXhwIjoxNzA2NDEzOTcyfQ.kZScdXO-e8KPyasY49ftBe8mQqpDBHe30kKnit_0Vco',1),(57,'Праведнослав','Кувалдович','Святославович','helper',1,'7993429188','pravednoslav','$2b$10$ZRHCn.gc7UANuD1nDhRk2.nnVUBE.UWXSSxuVxVNXCdvMSGSXNNja',NULL,1),(58,'Ирина','Павлова','Павловна','helper',1,'7993429188','irina','$2b$10$Xd9783ljE3OOEuYbb0ic8uNBvmXxzyIlmBKWegbmXpOPkSq3GZGQa','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsImlhdCI6MTcwNTg5Nzk0NiwiZXhwIjoxNzA1OTI2NzQ2fQ.EFocFXH9FwPvN2PQXQVWg6_yE9e-uSnAfyhVsswigeo',1),(59,'Татьяна','Пинчукова','Игоревна','helper',1,'7993429188','tatyana','$2b$10$1GigHnn6lL6VokPuGeQFQ.ICE1.oys5E.DjfR31Y0YpFPRCbU1zky',NULL,1),(60,'Данил','Заря','Артёмович','helper',1,'7956439188','danil','$2b$10$KTVLAc8Mwf8f/UR4YBNQdu2xpoCGTJnSYU.4q2fVpbo9jnhkxqG.O',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-27 13:30:31
