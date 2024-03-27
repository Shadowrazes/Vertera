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
  KEY `cbvc_idx` (`messageId`),
  CONSTRAINT `AttachToMsgFK` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (1,1,'/files/1/a9348906971dfbcf2835f44359476277.png'),(2,6,'/files/3/67acaccb9df2de102d68196b4a0eef9c.jpg'),(81,120,'/files/2024-01-22/a01461cc04be5720c1aec4efe1533708.jpg'),(82,120,'/files/2024-01-22/4ad6f9d025c65e37d564cbd8136502ba.jpg'),(83,121,'/files/2024-01-22/a01461cc04be5720c1aec4efe1533708.jpg'),(84,121,'/files/2024-01-22/4ad6f9d025c65e37d564cbd8136502ba.jpg'),(86,129,'/files/2024-02-05/9e82e5411d7bc5566262768d6973dda9.txt'),(87,129,'/files/2024-02-05/e5c41875664e7ae4b3c1c16b0ffce358.txt'),(88,140,'/files/2024-02-05/51c9a0d6f93673e8c02e333d90655b9f.txt'),(89,142,'/files/2024-02-05/4c81f75ce51b434b5ff7de6d7affbee6.jpg'),(90,142,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(91,143,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(92,144,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(93,145,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(94,146,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(95,147,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(96,148,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(97,149,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(98,150,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(99,151,'/files/2024-02-05/ef6ac87292a93caaea32a830c34508e5.jpg'),(100,160,'/files/2024-02-08/9e82e5411d7bc5566262768d6973dda9.txt'),(101,160,'/files/2024-02-08/e5c41875664e7ae4b3c1c16b0ffce358.txt'),(102,173,'/files/2024-02-08/9e82e5411d7bc5566262768d6973dda9.txt'),(103,181,'/files/2024-02-08/e5c41875664e7ae4b3c1c16b0ffce358.txt'),(104,185,'/files/2024-02-08/4e433939bbf63d8f79b70a54fc0f0622.jpg'),(105,185,'/files/2024-02-08/ab85e797a789be443312c368dedddc20.jpg');
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
  `idRef` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `ClientToUserFK` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,1),(4,0),(61,1),(62,100);
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
  `code` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CountryToTranslationFK_idx` (`nameCode`),
  CONSTRAINT `CountryToTranslationFK` FOREIGN KEY (`nameCode`) REFERENCES `translations` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'COUNTRY_DA68DD4FBC33438825D655343295525C','RU'),(2,'COUNTRY_7B880D1109031A03655B66ACD0C780FD','EN'),(3,'COUNTRY_5D68AC73CB08553D8DF7A4D1B4DC97A7','ES'),(4,'COUNTRY_6D095FF6963E42901E8DB74D905548A3','CS'),(5,'COUNTRY_CD8019F57C74BDD3556858914C505ED5','BG'),(6,'COUNTRY_875JWBF57C74BDD3556858914C505ED5','DE'),(7,'COUNTRY_G32BYQF57C74BDD3556858914C505ED5','HU'),(8,'COUNTRY_PER65NF57C74BDD3556858914C505ED5','KZ');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries_langs`
--

DROP TABLE IF EXISTS `countries_langs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries_langs` (
  `countryId` int NOT NULL,
  `langId` int NOT NULL,
  PRIMARY KEY (`countryId`,`langId`),
  KEY `LangToCountryFK_idx` (`langId`),
  CONSTRAINT `CountryToLangFK` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `LangToCountryFK` FOREIGN KEY (`langId`) REFERENCES `langs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries_langs`
--

LOCK TABLES `countries_langs` WRITE;
/*!40000 ALTER TABLE `countries_langs` DISABLE KEYS */;
INSERT INTO `countries_langs` VALUES (1,1),(2,2),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8);
/*!40000 ALTER TABLE `countries_langs` ENABLE KEYS */;
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
  KEY `HelperToDepartmentFK_idx` (`departmentId`)
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
-- Table structure for table `helper_permissions`
--

DROP TABLE IF EXISTS `helper_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helper_permissions` (
  `helperId` int unsigned NOT NULL,
  `sendMsg` tinyint NOT NULL DEFAULT '1',
  `helperEdit` tinyint NOT NULL DEFAULT '0',
  `themeEdit` tinyint NOT NULL DEFAULT '0',
  `translationEdit` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`helperId`),
  CONSTRAINT `HelperPermToHelperFK` FOREIGN KEY (`helperId`) REFERENCES `helpers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helper_permissions`
--

LOCK TABLES `helper_permissions` WRITE;
/*!40000 ALTER TABLE `helper_permissions` DISABLE KEYS */;
INSERT INTO `helper_permissions` VALUES (0,1,1,1,1),(2,1,0,0,0),(3,1,0,0,0),(5,1,0,0,0),(52,1,0,0,0),(53,1,0,0,0),(54,1,0,0,0),(55,1,0,0,0),(57,1,0,0,0),(58,1,0,0,0),(59,1,0,0,0),(60,1,0,0,0);
/*!40000 ALTER TABLE `helper_permissions` ENABLE KEYS */;
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
-- Table structure for table `langs`
--

DROP TABLE IF EXISTS `langs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `langs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `code` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `langs`
--

LOCK TABLES `langs` WRITE;
/*!40000 ALTER TABLE `langs` DISABLE KEYS */;
INSERT INTO `langs` VALUES (1,'Русский','RU'),(2,'English','EN'),(3,'Español','ES'),(4,'Čeština','CS'),(5,'Български','BG'),(6,'Deutsch','DE'),(7,'Magyar','HU'),(8,'Қазақша','KK');
/*!40000 ALTER TABLE `langs` ENABLE KEYS */;
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
  KEY `MsgToTicketFK_idx` (`ticketId`),
  FULLTEXT KEY `TextSearch_idx` (`text`),
  CONSTRAINT `MsgToTicketFK` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,2,1,'message',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2021-10-20 23:00:00',1),(2,2,1,1,'message',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2021-10-20 23:05:00',1),(3,4,3,2,'message',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-11-20 23:02:00',1),(4,3,4,2,'message',1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-11-20 23:06:00',1),(5,4,3,2,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-11-20 23:09:00',1),(6,1,3,3,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-11-20 23:19:00',1),(7,0,1,1,'reacton',1,'Оцените ответ','2021-10-20 23:07:00',1),(8,0,4,2,'helperChange',1,'Вашим вопросом занимается Алексей','2023-11-20 23:19:00',1),(70,1,3,17,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2023-12-10 00:09:04',1),(71,0,1,17,'system',0,'Вашим вопросом занимается Алексей ','2023-12-10 00:09:04',1),(72,0,1,18,'system',0,'Вашим вопросом занимается Алексей ','2023-12-10 00:09:04',1),(73,0,1,11,'system',0,'Вашим вопросом занимается Алексей ','2023-12-10 00:09:04',1),(84,1,2,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-04 20:55:36',1),(85,2,1,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-04 20:55:50',1),(86,2,1,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-04 20:57:16',1),(89,1,2,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-12 10:41:10',1),(90,1,2,1,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-12 10:45:23',1),(92,1,60,25,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:38:05',1),(93,0,1,25,'system',0,'Вашим вопросом занимается Данил','2024-01-22 10:38:05',1),(94,1,52,26,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:03',1),(95,0,1,26,'system',0,'Вашим вопросом занимается Иван','2024-01-22 10:39:03',1),(96,1,53,27,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:10',1),(97,0,1,27,'system',0,'Вашим вопросом занимается Дмитрий','2024-01-22 10:39:10',1),(98,1,54,28,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:14',1),(99,0,1,28,'system',0,'Вашим вопросом занимается Дмитрий','2024-01-22 10:39:14',1),(100,1,55,29,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:37',1),(101,0,1,29,'system',0,'Вашим вопросом занимается Матвей','2024-01-22 10:39:37',1),(102,1,2,30,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:38',1),(103,0,1,30,'system',0,'Вашим вопросом занимается Михаил','2024-01-22 10:39:38',1),(104,1,57,31,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:45',1),(105,0,1,31,'system',0,'Вашим вопросом занимается Праведнослав','2024-01-22 10:39:45',1),(106,1,58,32,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:46',1),(107,0,1,32,'system',0,'Вашим вопросом занимается Ирина','2024-01-22 10:39:46',1),(108,1,59,33,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:52',1),(109,0,1,33,'system',0,'Вашим вопросом занимается Татьяна','2024-01-22 10:39:52',1),(110,1,60,34,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:53',1),(111,0,1,34,'system',0,'Вашим вопросом занимается Данил','2024-01-22 10:39:53',1),(112,1,52,35,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:56',1),(113,0,1,35,'system',0,'Вашим вопросом занимается Иван','2024-01-22 10:39:56',1),(114,1,53,36,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:39:57',1),(115,0,1,36,'system',0,'Вашим вопросом занимается Дмитрий','2024-01-22 10:39:57',1),(116,1,54,37,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:40:00',1),(117,0,1,37,'system',0,'Вашим вопросом занимается Дмитрий','2024-01-22 10:40:00',1),(118,1,55,38,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:40:00',1),(119,0,1,38,'system',0,'Вашим вопросом занимается Матвей','2024-01-22 10:40:00',1),(120,52,1,26,'message',0,'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?','2024-01-22 11:00:27',1),(121,52,1,35,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 11:08:18',1),(124,0,1,17,'helperChange',0,'Вашим вопросом занимается Ирина','2024-01-22 11:59:28',1),(125,0,1,25,'helperChange',0,'Вашим вопросом занимается Ирина','2024-01-22 12:02:38',1),(126,55,1,38,'message',0,'test','2024-01-25 12:14:43',1),(127,1,55,38,'message',0,'test','2024-01-25 12:15:26',1),(128,0,1,38,'system',0,'Обращение разделено на 2 новых','2024-01-26 10:53:31',1),(129,4,55,41,'common',0,'<p><strong>TEST</strong></p>\n','2024-02-05 15:56:38',1),(130,0,4,41,'system',0,'Обращение разделено на 2 новых','2024-02-05 15:58:04',1),(131,0,4,42,'system',0,'Обращение создано разделением','2024-02-05 15:58:04',1),(132,55,52,42,'common',0,'<p><strong>TE</strong></p>\n','2024-02-05 15:58:04',1),(133,0,4,43,'system',0,'Обращение создано разделением','2024-02-05 15:58:04',1),(134,55,2,43,'common',0,'<p><em>ST</em></p>\n','2024-02-05 15:58:04',1),(135,0,1,3,'system',0,'Обращение разделено на 2 новых','2024-02-05 16:07:24',1),(136,0,1,44,'system',0,'Обращение создано разделением','2024-02-05 16:07:24',1),(137,3,60,44,'common',0,'<p><strong>1</strong></p>\n','2024-02-05 16:07:24',1),(138,0,1,45,'system',0,'Обращение создано разделением','2024-02-05 16:07:24',1),(139,3,55,45,'common',0,'<p>2</p>\n','2024-02-05 16:07:24',1),(140,4,2,43,'common',0,'<p>Тест <strong>123</strong></p>\n','2024-02-05 16:32:28',1),(141,4,2,43,'common',0,'<p>Ещё одно сообщение</p>\n','2024-02-05 16:32:45',1),(142,4,3,46,'common',0,'<p>ААА</p>\n','2024-02-05 17:49:21',1),(143,4,3,46,'common',0,'<p>ещё сообщение</p>\n','2024-02-05 17:51:04',1),(144,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:14',1),(145,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:14',1),(146,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:15',1),(147,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:15',1),(148,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:15',1),(149,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:15',1),(150,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:15',1),(151,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:15',1),(152,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:18',1),(153,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:18',1),(154,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:18',1),(155,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:51:18',1),(156,4,3,46,'common',0,'<p>арыа</p>\n','2024-02-05 17:53:14',1),(157,4,3,46,'common',0,'<p></p>\n','2024-02-05 17:53:14',1),(158,52,4,42,'common',0,'<p>ырыары</p>\n','2024-02-07 14:41:44',1),(159,52,4,42,'common',0,'<p>чтчмтр</p>\n','2024-02-07 14:41:49',1),(160,4,3,47,'common',0,'<p><strong>123</strong></p>\n','2024-02-08 15:52:59',1),(161,0,4,47,'system',0,'Обращение разделено на 2 новых','2024-02-08 15:53:42',1),(162,0,4,48,'system',0,'Обращение создано разделением','2024-02-08 15:53:42',1),(163,3,55,48,'common',0,'<p>1</p>\n','2024-02-08 15:53:42',1),(164,0,4,49,'system',0,'Обращение создано разделением','2024-02-08 15:53:42',1),(165,3,55,49,'common',0,'<p>2</p>\n','2024-02-08 15:53:42',1),(166,3,4,48,'common',0,'<p>Ответим через 5 минут</p>\n','2024-02-08 15:55:44',1),(167,3,4,48,'common',0,'<p>Помогите ответить</p>\n','2024-02-08 15:56:06',2),(168,3,4,48,'common',0,'<p></p>\n','2024-02-08 15:56:14',2),(169,2,4,48,'common',0,'<p>Помогаю</p>\n','2024-02-08 15:56:47',2),(170,3,4,48,'common',0,'<p>Спасибо</p>\n','2024-02-08 15:56:57',2),(171,3,4,48,'common',0,'<p><strong>Финальный ответ на вопрос</strong></p>\n','2024-02-08 15:57:15',1),(172,3,4,48,'common',0,'<p></p>\n','2024-02-08 15:57:17',1),(173,4,3,50,'common',0,'<p><strong>Сообщение</strong></p>\n','2024-02-08 16:04:20',1),(174,0,4,50,'system',0,'Обращение разделено на 2 новых','2024-02-08 16:06:21',1),(175,0,4,51,'system',0,'Обращение создано разделением','2024-02-08 16:06:21',1),(176,3,53,51,'common',0,'<p><strong>Сообщение 1</strong></p>\n','2024-02-08 16:06:21',1),(177,0,4,52,'system',0,'Обращение создано разделением','2024-02-08 16:06:21',1),(178,3,2,52,'common',0,'<p><strong>Сообещнеи 2</strong></p>\n','2024-02-08 16:06:21',1),(179,3,4,51,'common',0,'<p>Подождите 5 минут, уточним!</p>\n','2024-02-08 16:11:47',1),(180,3,4,51,'common',0,'<p>Подскажите пожалуйста</p>\n','2024-02-08 16:12:38',2),(181,2,4,51,'common',0,'<p>Подсказал</p>\n','2024-02-08 16:13:34',2),(182,3,4,51,'common',0,'<p>Спасибо</p>\n','2024-02-08 16:13:58',2),(183,3,4,51,'common',0,'<p>Финальный ответ на вопрос</p>\n','2024-02-08 16:16:24',1),(184,3,4,51,'common',0,'<p></p>\n','2024-02-08 16:16:28',1),(185,4,3,53,'common',0,'<p>ыпцпцпцпцууп<strong>впйпйпй</strong><strong><ins>пуйп2пу2п</ins></strong></p>\n','2024-02-08 17:12:15',1),(186,3,4,53,'common',0,'<p>аьиыиыаиыиы</p>\n','2024-02-08 17:18:41',1),(187,3,4,53,'common',0,'<p>вфмпвфмпф</p>\n','2024-02-08 17:19:00',1),(188,3,4,53,'common',0,'<p></p>\n','2024-02-08 17:19:14',1),(189,3,4,53,'common',0,'<p></p>\n','2024-02-08 17:19:19',1),(190,4,53,54,'common',0,'<p>йауйайуайа</p>\n','2024-02-08 17:20:04',1),(191,0,4,54,'system',0,'Обращение разделено на 2 новых','2024-02-08 17:21:09',1),(192,0,4,55,'system',0,'Обращение создано разделением','2024-02-08 17:21:09',1),(193,3,54,55,'common',0,'<p>ааааааааа</p>\n','2024-02-08 17:21:09',1),(194,0,4,56,'system',0,'Обращение создано разделением','2024-02-08 17:21:09',1),(195,3,57,56,'common',0,'<p>вввввв</p>\n','2024-02-08 17:21:09',1),(196,3,4,46,'common',0,'<p>вввв</p>\n','2024-02-09 15:31:51',1),(197,3,4,46,'common',0,'<p></p>\n','2024-02-09 15:32:28',1),(198,1,2,61,'common',0,'help','2024-03-20 19:22:13',1),(202,1,3,65,'common',0,'help','2024-03-22 10:56:00',1),(203,1,53,67,'common',0,'help','2024-03-22 11:01:26',1),(204,1,3,68,'common',0,'help','2024-03-22 11:03:40',1),(206,0,1,68,'system',0,'Наставник подключен к диалогу, ожидайте ответа.','2024-03-22 19:59:32',1),(207,2,1,30,'message',0,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-01-22 10:49:38',1);
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
  `visibility` smallint NOT NULL DEFAULT '3',
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
INSERT INTO `subthemes` VALUES (1,'SUBTHEME_3791FEF4A7B43F0667C784E1902F4DD5',1,1,1),(2,'SUBTHEME_2FFD3D019ADB436A53191D91B2EAD5C6',1,2,1),(3,'SUBTHEME_27D3D0063AC3B364A3C1C03E4D91C351',1,3,1),(4,'SUBTHEME_D4404F2C27BD3E74B7D6D46BE3982208',1,4,1),(5,'SUBTHEME_466892FF57D7BD14D44DB226CB43777B',1,5,1),(6,'SUBTHEME_195390D8958F2B5C58F5AE60A1F0A96D',1,6,1),(7,'SUBTHEME_DEDE99743C1EDDC0CD1DD53CEF647244',1,7,1),(8,'SUBTHEME_CDA6854D9A99F697F61C360E1B06DEC9',2,1,1),(9,'SUBTHEME_BE33DF748F61F3E933C8EF8140265A73',2,2,1),(10,'SUBTHEME_1AB4B35179E42D4C85792732A1F7A9F1',2,3,1),(11,'SUBTHEME_856951C4DDFE9DB4B92800C0A2DC0F2E',2,4,1),(12,'SUBTHEME_0094CBABD8BA081F99A65818F2842B32',3,1,1),(13,'SUBTHEME_CFF62E55D4CD5359C02688018B38E22E',3,2,1),(14,'SUBTHEME_B75EF765365340792F441E5A3D1954CE',3,3,1),(15,'SUBTHEME_3AD1866AD8BF44DE49E6E9ED2AD238BE',3,4,1),(16,'SUBTHEME_D433BFB31B8FB5A7121A732236D1E943',3,5,1),(17,'SUBTHEME_BCD38D13C693168BA9CCB12830746F75',3,6,1),(18,'SUBTHEME_9F893128CB81C871D8701DB6383FBF09',3,7,1),(19,'SUBTHEME_AE71CA092765E64CAD45D6E504E57888',3,8,1),(20,'SUBTHEME_82BA4F94DCEF41AE3F1B6010A97ADAF4',3,9,1),(21,'SUBTHEME_9B0A22554460A2D1F00A9CE733640DBB',4,1,1),(22,'SUBTHEME_CAE57665EC55742A1D80D9BBB7203551',4,2,1),(23,'SUBTHEME_F330B7610935D1415505529FD2E8704F',4,3,1),(24,'SUBTHEME_05BFDD79152E37FD099ECB8515E86923',4,4,1),(25,'SUBTHEME_1629C3DAB62AA9DDFE0E139E9D8534BA',5,1,1),(26,'SUBTHEME_6A9985B5567A85DEAF05D89AB1B4DAD6',5,2,1),(27,'SUBTHEME_6933ED63E4BE6E7416DCEC5E6FD47EB7',5,3,1),(28,'SUBTHEME_2C0C943306B7B8134D91AEDA3AC440EB',5,4,1),(29,'SUBTHEME_F75BD25198806C485AC7937DAAC59CE5',5,5,1),(30,'SUBTHEME_41E44D29CA57B3DCBCF861507AAD3D11',6,1,1),(31,'SUBTHEME_2F3CB3228C032D52338C6508C3946798',6,2,1),(32,'SUBTHEME_9A18545D2F01FE8FF450D2C1594BAF3A',6,3,1),(33,'SUBTHEME_EBC51780F5BB7D03E6BEF01D7DB2D377',6,4,1),(34,'SUBTHEME_BA8646B918511048A7ECC4102BDEAE9B',6,5,1),(35,'SUBTHEME_D2957B752D574C0FC1337F602C8EE9CE',6,6,1),(36,'SUBTHEME_B64BC46C5F9B878A84D52BCCC0F3F048',6,7,1),(37,'SUBTHEME_C48C34B64F9D543732BE24D52D4B0286',7,1,1),(38,'SUBTHEME_4FA586BC9999E3CC571CB5256E7CACFE',7,2,1),(39,'SUBTHEME_BFE65E656AC4B69828052BA0DF6F5393',7,3,1),(40,'SUBTHEME_7DB13BA1488118A5CF5288417ED6F7C4',7,4,1),(41,'SUBTHEME_F6266D55C8143A82E628DB1B2160B83A',7,5,1),(42,'SUBTHEME_BC102C098E5ADD9A1A38DC9A2D50B778',7,6,1),(43,'SUBTHEME_7C254E0A037011015A3D0DCF65EA8224',7,7,1),(44,'SUBTHEME_36553BE76B68C2E0216D110D69B248F5',7,8,1),(45,'SUBTHEME_E09BBE3DB9FF2672931946CE8A00E32D',8,1,1),(46,'SUBTHEME_95083C84EBDB452FFE465F8AFAFF1CDF',8,2,1),(47,'SUBTHEME_30AAECCFAD74E17E43D0069E3C686342',8,3,1),(48,'SUBTHEME_7FA72A154EFA8BBE2C6B26A80F94B690',8,4,1),(49,'SUBTHEME_73B9F4FE23FDA000CAC8AF69BF0F793A',8,5,1),(50,'SUBTHEME_5D599EA92F1ADF2ECC9E29ED08A14B9F',8,6,1),(51,'SUBTHEME_1872F37824438B45EEBA91A29C1F8CE3',9,1,1),(52,'SUBTHEME_7302DB94A9A9B0ECEF401908266F9FF6',9,2,1),(53,'SUBTHEME_B8EEF7D148D43BE9829E51BB2E9C04F7',9,3,1),(54,'SUBTHEME_09409BBB92115518E7FB968D2BD5370C',9,4,1),(55,'SUBTHEME_C3D2EB60ECC621066473D3F57E156F79',10,1,1),(56,'SUBTHEME_2DB0E2C93EC649B52FA744F784BCA9D7',10,2,1),(57,'SUBTHEME_5880754A7F37557387991A21F68FFD19',10,3,1),(58,'SUBTHEME_F364B6F5BEE237B2AF3D798CBBA58178',10,4,1),(59,'SUBTHEME_F0ABB7FFBD78CA49BDFA9EDE8D828759',10,5,1),(60,'SUBTHEME_D9E296D403363B8E28A83A49CBEDCE4B',11,1,1),(61,'SUBTHEME_532B3C1C4548CBC7AD08358F7EDCC3B3',11,2,1),(62,'SUBTHEME_09D6FCD707A52B03CAC70622BAAA969C',11,3,1),(63,'SUBTHEME_F178AF36EF770E7472E1BF3BA9A4F628',11,4,1),(64,'SUBTHEME_75ED71CAB0FCA5D6EFC5413067176EE8',12,1,1),(65,'SUBTHEME_6A34C9DDD2A387FEB3A2B741126F3B28',12,2,1),(66,'SUBTHEME_DF5EE7BB4A607B52AE356F1EC96AC4BB',12,3,1),(67,'SUBTHEME_00521848B6FDCE2DB2B6DE43AD8DF4C1',12,4,1),(68,'SUBTHEME_814E983A7A42311B40000316CD6FEA66',12,5,1),(69,'SUBTHEME_E86D2CDBD946D92B81FCA31CC316C51F',12,6,1),(70,'SUBTHEME_F5FBF9A28B69BEA951615C723C1B5814',13,1,1),(71,'SUBTHEME_1551AAD11A91FEE8CB86A619798F5802',13,2,1),(72,'SUBTHEME_8199F66DC6A0CF5238875AD93E3216A3',13,3,1),(73,'SUBTHEME_DAF14AD3D2A51FF595143EB11C6058CA',14,1,1),(74,'SUBTHEME_1FA7F8484D6740A5A6861BE059398C2A',15,1,1),(75,'SUBTHEME_73450E5BC0BF9FDD5DA8FCC983711948',16,1,1),(76,'SUBTHEME_9F4A994E4156B5B3C0F4E0A4297F929E',17,1,1),(77,'SUBTHEME_5F87183289F736EDD8C858F8E6F8AC5B',17,2,1),(78,'SUBTHEME_FC76E6FB2C7FB229E7A004DA31BB7614',17,3,1),(79,'SUBTHEME_08BC30B7560FB30D7C8706906D211911',17,4,1),(80,'SUBTHEME_32C9FA2A341E8A2242F539C547108CBD',17,5,1),(81,'SUBTHEME_4B0F821A9F01F151086F3ECE9463D3D9',17,6,1),(82,'SUBTHEME_C897E225C83FE39AD6FEDAAF3B000D18',18,1,1),(83,'SUBTHEME_4F085E17BB0F40A975F3340479F68DBF',18,2,1),(84,'SUBTHEME_DF145A7CB0E0E053C2CDC14D2ADA2C65',18,3,1),(85,'SUBTHEME_4DD085E409A74CDF15F95BAC32F6D739',18,4,1),(86,'SUBTHEME_57B07F24A750F423F43266BCC9EE9F95',18,5,1),(87,'SUBTHEME_5B344D5390826BBCD17E9C1E4420B571',18,6,1),(88,'SUBTHEME_DFDD3F844F1351790CE078D00E34BF9E',19,1,1),(89,'SUBTHEME_5DF5056C148DCDF0E0D160F706AE2A43',19,2,1),(90,'SUBTHEME_ED9F431D13C117D4C5CFF2034D214EDD',19,3,1),(91,'SUBTHEME_5CB1DFDF3B3F45575979842827ACC514',19,4,1),(92,'SUBTHEME_1B6FE7554739FBB467BEC2B73C9BE2BA',20,1,1),(93,'SUBTHEME_79C879A54F974EFAA7B545BA9DFFCEDA',20,2,1),(94,'SUBTHEME_03BCBA2234CA2F7BE1A4B72EF7BC5D84',20,3,1),(95,'SUBTHEME_631ACA7E6C1B50D33F281113053B1497',20,4,1),(96,'SUBTHEME_5E6E501687DB8A8A0FD85ECCF31AAC7D',20,5,1),(97,'SUBTHEME_37E89DD02724B49C20B1D466C3E51D20',21,1,1),(98,'SUBTHEME_81A0D424C89CE99616AB3C3F6EB1C74D',21,2,1),(99,'SUBTHEME_78BF8C1DE2666BBA06AD753197005202',21,3,1),(100,'SUBTHEME_1F09F9D3822379F893845DB02F7658C4',21,4,1),(101,'SUBTHEME_177511656D886BA7856EB83981CF6F02',21,5,1),(102,'SUBTHEME_232CA03AE0637D05C316595CBF640D2E',22,1,1),(103,'SUBTHEME_271CA31E7FCEDB52FFC276D808461A18',23,1,1);
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
  `visibility` smallint NOT NULL DEFAULT '3',
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
INSERT INTO `themes` VALUES (1,'THEME_EDB3F5C0C392DF7F86A0358270BDE0E0',1,1,1),(2,'THEME_D0C4D0A6021EDC13E8149B07BE2304F4',1,2,1),(3,'THEME_C00FAF9F4A096FBD1171E05FA51C00D7',1,3,1),(4,'THEME_85DD5017C62149565B909B1341A62EDB',1,4,1),(5,'THEME_3C2D2829736172255113FF2A2D16D2D5',1,5,1),(6,'THEME_5F7249CB662E88CC370B52273D873EC8',1,6,1),(7,'THEME_9322CD7D3A2CBCAEF4DF26D56272AA7B',1,7,1),(8,'THEME_6FC86E481C945C253298F5E8EDA1F7A2',1,8,1),(9,'THEME_0C63C3BC3483C71F249BE17C66AEA6FA',1,9,1),(10,'THEME_FDE95BC2F0C449D0E70C489215D8EBD9',1,10,1),(11,'THEME_51B1143794A571DE66866BEFC03A49F9',1,11,1),(12,'THEME_286EB35B8608DF561F9CBC460B85CCCC',1,12,1),(13,'THEME_2BB3E5D9E8F7BBFF2273F358E3F4542B',1,13,1),(14,'THEME_74AD89D3BCF2883654054BD2BC6BA62D',1,14,1),(15,'THEME_E54210E8790DFAA86ADD8A7499B81342',2,1,1),(16,'THEME_599F5335BC00A1A965AD812265112C78',2,2,1),(17,'THEME_DB9A04D8A5C3F8ECB78D92D9A5CCC307',2,3,1),(18,'THEME_56F572513B8C5C785BABF5959CF359FF',2,4,1),(19,'THEME_57326D97A62056551CA14BB256FD9189',2,5,1),(20,'THEME_1A7CA3DC597DB324319DB7B11C545808',2,6,1),(21,'THEME_87BD9A7DFA1FD029A003BB6BD2DE072C',2,7,1),(22,'THEME_18B7E833D77E8B0866831D122ED0A077',2,8,1),(23,'THEME_9B4B27D49326F87DA1493DC1A29FE749',2,9,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_statuses`
--

LOCK TABLES `ticket_statuses` WRITE;
/*!40000 ALTER TABLE `ticket_statuses` DISABLE KEYS */;
INSERT INTO `ticket_statuses` VALUES (4,'TICKETSTATUS_08F55006CF2D6B8E04B9A6A6929DAD22'),(2,'TICKETSTATUS_1E9D7762BEDE1EE920BDB6FCFC6CF403'),(1,'TICKETSTATUS_7E7FC777A5840F50BA8E03A4B78ACA47'),(5,'TICKETSTATUS_9F8568BC05C18BBB6AD1F08E9E2FE940'),(7,'TICKETSTATUS_B8C1135E8E7C840E57A0F98D3946C574'),(3,'TICKETSTATUS_B9C8AB323A26E59E41F56A62E1B4E5D1'),(6,'TICKETSTATUS_FEC7181AD224BDD6DFE9F161E960C936');
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
  `initiatorId` int unsigned NOT NULL,
  `recipientId` int unsigned NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,2,NULL,'2021-10-20 00:00:00','Без названия',1,1,2,2,1,'6aefa941ba63e7aa593780d33ab4b0b5'),(2,4,3,NULL,'2023-11-20 00:00:00','Без названия',1,14,73,2,0,'ee0e4365a20d76a0457b4a2c1ece0be9'),(3,1,3,NULL,'2023-11-20 00:00:00','Без названия',2,20,92,2,NULL,'b5dd73ae6bb0569fd2402ca636e8a509'),(11,1,2,NULL,'2023-11-19 01:17:49','Без названия',1,6,31,2,NULL,'d9517fae658a56b4b4c5263f82253cf1'),(17,1,58,NULL,'2023-12-10 00:09:04','Без названия',1,8,45,3,NULL,'dc47f981b90139c954b480dd805754d5'),(18,1,52,NULL,'2023-12-10 00:19:04','Без названия',1,4,21,3,NULL,'d121f56e1c766be7e0e0882c49c32ebf'),(25,1,58,NULL,'2024-01-22 10:38:05','Без названия',1,6,30,3,NULL,'f68b7b3ddc772c27355fe2e4147f2210'),(26,1,52,NULL,'2024-01-22 10:39:03','Без названия',1,6,30,3,NULL,'f3f61458ad397556529882d4ba7658a8'),(27,1,53,NULL,'2024-01-22 10:39:10','Без названия',1,6,31,1,NULL,'4234f7dfb2d17975f3917d77dba54dae'),(28,1,54,NULL,'2024-01-22 10:39:14','Без названия',1,6,31,1,NULL,'14753d4d6cc6405e3fd4ac92db77c73b'),(29,1,55,NULL,'2024-01-22 10:39:37','Без названия',1,6,32,1,NULL,'ad7cac978e219272b140a2a23a3d9fa5'),(30,1,2,NULL,'2024-01-22 10:39:38','Без названия',1,6,32,3,NULL,'1ca9b76bab7504effb76f0d25b4b78db'),(31,1,57,NULL,'2024-01-22 10:39:45','Без названия',1,6,33,1,NULL,'14bba595f9d54ce29bd97736a69bd612'),(32,1,58,NULL,'2024-01-22 10:39:46','Без названия',1,6,33,3,NULL,'267f4aa2a4376df77b22f1c8d1c4af7c'),(33,1,59,NULL,'2024-01-22 10:39:52','Без названия',1,6,34,1,NULL,'fca957e49de28a92da5e228ada162728'),(34,1,60,NULL,'2024-01-22 10:39:53','Без названия',1,6,34,1,NULL,'31132fe7023c8455b78b7a215ab6b89b'),(35,1,52,NULL,'2024-01-22 10:39:56','Без названия',1,6,35,2,1,'c370e49aa507ac8f3c76085689426678'),(36,1,53,NULL,'2024-01-22 10:39:57','Без названия',1,6,35,1,NULL,'4bf494580b2b3f15a3b3b05caaabcf90'),(37,1,54,3,'2024-01-22 10:40:00','Без названия',1,6,36,4,NULL,'8715bc5e838bd321eed485027780b555'),(38,1,55,NULL,'2024-01-22 10:40:00','Без названия',1,6,36,2,NULL,'05902843491977296984c7ebcc3ba5ce'),(41,4,55,NULL,'2024-02-05 15:56:38','Test',1,2,9,2,NULL,'3bdb6e44a02a6d24ae3d8d651a5c2699'),(42,4,52,NULL,'2024-02-05 15:58:04','TE',1,3,14,3,NULL,'8fd3eb066105651f70363d5509e42769'),(43,4,3,NULL,'2024-02-05 15:58:04','ST',2,16,75,4,NULL,'aaa89374abfb62173970b71d80f76183'),(44,1,60,NULL,'2024-02-05 16:07:24','Тикет 1',2,16,75,1,NULL,'5d90c7a9acf99f1c176cbc42b2070e04'),(45,1,55,NULL,'2024-02-05 16:07:24','Тикет 2',1,2,10,1,NULL,'f7a7962f44c7526c5943b2fa428df1ec'),(46,4,3,NULL,'2024-02-05 17:49:21','Тестов Тест',1,3,19,2,NULL,'7c67bff213e154cafd619831e1a0050c'),(47,4,3,NULL,'2024-02-08 15:52:59','Тест финал',1,1,2,2,NULL,'fbc116e427a64d00725104b3944ced92'),(48,4,3,NULL,'2024-02-08 15:53:42','1',1,2,11,2,NULL,'b1ed00070e4cf47c35ddb7909e3bd0fd'),(49,4,55,NULL,'2024-02-08 15:53:42','2',1,2,11,1,NULL,'0fcd5832d6e529d8cc2ed6d2a5269e6e'),(50,4,3,NULL,'2024-02-08 16:04:20','ФИнальный тикет',1,2,9,2,NULL,'e340b6694fc6762cb0c3a8c3558621d1'),(51,4,3,NULL,'2024-02-08 16:06:21','Финальный 1',1,1,2,2,NULL,'bb04c4c3292e7bd2ecdaf34d4523d4ac'),(52,4,2,NULL,'2024-02-08 16:06:21','Финальный 2',2,15,74,1,NULL,'e0ebdc85eb2852b31ec26ea40f3701f0'),(53,4,3,NULL,'2024-02-08 17:12:15','Текст текст текст и тд.',1,8,47,5,NULL,'d0645c0ab08893491a48359bed460e89'),(54,4,53,NULL,'2024-02-08 17:20:04','файайайай',1,5,27,2,1,'eb23f637055152911ef245b2dc35bb1f'),(55,4,54,NULL,'2024-02-08 17:21:09','фвафваф',1,10,55,3,NULL,'860b0a7bcbc0743b2f775453d269a1d2'),(56,4,57,3,'2024-02-08 17:21:09','аааааа',2,17,78,4,NULL,'d0657013e696e4bc094d204d89917b38'),(61,1,2,NULL,'2024-03-20 19:22:13','123',1,1,1,6,NULL,'be5027c998213927951c7e23d1ff97da'),(65,1,3,NULL,'2024-03-22 10:56:00','123',1,1,1,1,NULL,'1bdaa1d1a0a2badfcd4bd0247262d31a'),(67,1,53,NULL,'2024-03-22 11:01:26','123',1,1,1,1,NULL,'c5d81319fd86e5a5e79a9fb3e405a704'),(68,1,3,4,'2024-03-22 11:03:40','123',1,1,1,7,NULL,'1321595b08a4f7d2bba44f39abb2fbf6');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets_log`
--

DROP TABLE IF EXISTS `tickets_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets_log` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `type` varchar(45) NOT NULL,
  `ticketId` int unsigned NOT NULL,
  `initiatorId` int NOT NULL,
  `info` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TicketLogToTicketFK_idx` (`ticketId`),
  CONSTRAINT `TicketLogToTicketFK` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets_log`
--

LOCK TABLES `tickets_log` WRITE;
/*!40000 ALTER TABLE `tickets_log` DISABLE KEYS */;
INSERT INTO `tickets_log` VALUES (1,'2024-01-25 12:14:43','msgSend',38,55,'Отправил сообщение'),(2,'2024-01-25 12:15:26','msgSend',38,1,'Отправил сообщение'),(3,'2024-01-26 10:53:31','msgSend',38,0,'Отправил сообщение'),(4,'2024-01-26 10:53:31','split',38,55,'Разделил'),(13,'2024-01-26 10:53:31','statusChange',38,0,'Закрыл'),(14,'2024-02-04 22:07:29','statusChange',18,3,'В работе'),(15,'2024-02-05 15:56:38','create',41,4,'Создал'),(16,'2024-02-05 15:56:38','helperAssign',41,0,'Назначен куратор'),(17,'2024-02-05 15:56:38','msgSend',41,4,'Отправил сообщение'),(18,'2024-02-05 15:58:04','msgSend',41,0,'Отправил сообщение'),(19,'2024-02-05 15:58:04','split',41,55,'Разделил'),(20,'2024-02-05 15:58:04','splitCreate',42,55,'Создал (сплит)'),(21,'2024-02-05 15:58:04','msgSend',42,0,'Отправил сообщение'),(22,'2024-02-05 15:58:04','helperAssign',42,0,'Назначен куратор'),(23,'2024-02-05 15:58:04','msgSend',42,55,'Отправил сообщение'),(24,'2024-02-05 15:58:04','splitCreate',43,55,'Создал (сплит)'),(25,'2024-02-05 15:58:04','msgSend',43,0,'Отправил сообщение'),(26,'2024-02-05 15:58:04','helperAssign',43,0,'Назначен куратор'),(27,'2024-02-05 15:58:04','msgSend',43,55,'Отправил сообщение'),(28,'2024-02-05 15:58:04','statusChange',41,0,'Закрыл'),(29,'2024-02-05 16:07:24','msgSend',3,0,'Отправил сообщение'),(30,'2024-02-05 16:07:24','split',3,3,'Разделил'),(31,'2024-02-05 16:07:24','splitCreate',44,3,'Создал (сплит)'),(32,'2024-02-05 16:07:24','msgSend',44,0,'Отправил сообщение'),(33,'2024-02-05 16:07:24','helperAssign',44,0,'Назначен куратор'),(34,'2024-02-05 16:07:24','msgSend',44,3,'Отправил сообщение'),(35,'2024-02-05 16:07:24','splitCreate',45,3,'Создал (сплит)'),(36,'2024-02-05 16:07:24','msgSend',45,0,'Отправил сообщение'),(37,'2024-02-05 16:07:24','helperAssign',45,0,'Назначен куратор'),(38,'2024-02-05 16:07:24','msgSend',45,3,'Отправил сообщение'),(39,'2024-02-05 16:07:24','statusChange',3,0,'Закрыл'),(40,'2024-02-05 16:15:40','helperAssign',18,3,'Изменил куратора'),(41,'2024-02-05 16:32:28','msgSend',43,4,'Отправил сообщение'),(42,'2024-02-05 16:32:45','msgSend',43,4,'Отправил сообщение'),(43,'2024-02-05 16:36:45','statusChange',43,3,'В работе'),(44,'2024-02-05 16:37:03','statusChange',43,3,'Статус'),(45,'2024-02-05 16:44:42','helperAssign',43,2,'Изменил куратора'),(46,'2024-02-05 16:59:49','statusChange',30,2,'В работе'),(47,'2024-02-05 17:49:21','create',46,4,'Создал'),(48,'2024-02-05 17:49:21','helperAssign',46,0,'Назначен куратор'),(49,'2024-02-05 17:49:21','msgSend',46,4,'Отправил сообщение'),(50,'2024-02-05 17:51:04','msgSend',46,4,'Отправил сообщение'),(51,'2024-02-05 17:51:14','msgSend',46,4,'Отправил сообщение'),(52,'2024-02-05 17:51:14','msgSend',46,4,'Отправил сообщение'),(53,'2024-02-05 17:51:15','msgSend',46,4,'Отправил сообщение'),(54,'2024-02-05 17:51:15','msgSend',46,4,'Отправил сообщение'),(55,'2024-02-05 17:51:15','msgSend',46,4,'Отправил сообщение'),(56,'2024-02-05 17:51:15','msgSend',46,4,'Отправил сообщение'),(57,'2024-02-05 17:51:15','msgSend',46,4,'Отправил сообщение'),(58,'2024-02-05 17:51:15','msgSend',46,4,'Отправил сообщение'),(59,'2024-02-05 17:51:18','msgSend',46,4,'Отправил сообщение'),(60,'2024-02-05 17:51:18','msgSend',46,4,'Отправил сообщение'),(61,'2024-02-05 17:51:18','msgSend',46,4,'Отправил сообщение'),(62,'2024-02-05 17:51:18','msgSend',46,4,'Отправил сообщение'),(63,'2024-02-05 17:53:14','msgSend',46,4,'Отправил сообщение'),(64,'2024-02-05 17:53:14','msgSend',46,4,'Отправил сообщение'),(65,'2024-02-05 18:06:07','statusChange',42,52,'В работе'),(66,'2024-02-06 16:02:30','statusChange',46,3,'В работе'),(67,'2024-02-07 14:41:44','statusChange',42,52,'В работе'),(68,'2024-02-07 14:41:44','msgSend',42,52,'Отправил сообщение'),(69,'2024-02-07 14:41:49','statusChange',42,52,'В работе'),(70,'2024-02-07 14:41:49','msgSend',42,52,'Отправил сообщение'),(71,'2024-02-08 15:52:59','create',47,4,'Создал'),(72,'2024-02-08 15:52:59','helperAssign',47,0,'Назначен куратор'),(73,'2024-02-08 15:52:59','msgSend',47,4,'Отправил сообщение'),(74,'2024-02-08 15:53:42','msgSend',47,0,'Отправил сообщение'),(75,'2024-02-08 15:53:42','split',47,3,'Разделил'),(76,'2024-02-08 15:53:42','splitCreate',48,3,'Создал (сплит)'),(77,'2024-02-08 15:53:42','msgSend',48,0,'Отправил сообщение'),(78,'2024-02-08 15:53:42','helperAssign',48,0,'Назначен куратор'),(79,'2024-02-08 15:53:42','msgSend',48,3,'Отправил сообщение'),(80,'2024-02-08 15:53:42','splitCreate',49,3,'Создал (сплит)'),(81,'2024-02-08 15:53:42','msgSend',49,0,'Отправил сообщение'),(82,'2024-02-08 15:53:42','helperAssign',49,0,'Назначен куратор'),(83,'2024-02-08 15:53:42','msgSend',49,3,'Отправил сообщение'),(84,'2024-02-08 15:53:42','statusChange',47,0,'Закрыл'),(85,'2024-02-08 15:54:34','statusChange',48,55,'В работе'),(86,'2024-02-08 15:54:47','helperAssign',48,55,'Изменил куратора'),(87,'2024-02-08 15:55:44','statusChange',48,3,'В работе'),(88,'2024-02-08 15:55:44','msgSend',48,3,'Отправил сообщение'),(89,'2024-02-08 15:55:54','assistantConn',48,2,'Подключен к диалогу'),(90,'2024-02-08 15:55:54','statusChange',48,0,'На уточнении'),(91,'2024-02-08 15:56:06','msgSend',48,3,'Отправил сообщение'),(92,'2024-02-08 15:56:14','msgSend',48,3,'Отправил сообщение'),(93,'2024-02-08 15:56:47','msgSend',48,2,'Отправил сообщение'),(94,'2024-02-08 15:56:57','msgSend',48,3,'Отправил сообщение'),(95,'2024-02-08 15:57:01','assistantConn',48,2,'Отключен от диалога'),(96,'2024-02-08 15:57:01','statusChange',48,0,'В работе'),(97,'2024-02-08 15:57:15','statusChange',48,3,'В работе'),(98,'2024-02-08 15:57:15','msgSend',48,3,'Отправил сообщение'),(99,'2024-02-08 15:57:17','statusChange',48,3,'В работе'),(100,'2024-02-08 15:57:17','msgSend',48,3,'Отправил сообщение'),(101,'2024-02-08 15:57:18','statusChange',48,3,'Закрыл'),(102,'2024-02-08 16:04:20','create',50,4,'Создал'),(103,'2024-02-08 16:04:20','helperAssign',50,0,'Назначен куратор'),(104,'2024-02-08 16:04:20','msgSend',50,4,'Отправил сообщение'),(105,'2024-02-08 16:06:21','msgSend',50,0,'Отправил сообщение'),(106,'2024-02-08 16:06:21','split',50,3,'Разделил'),(107,'2024-02-08 16:06:21','splitCreate',51,3,'Создал (сплит)'),(108,'2024-02-08 16:06:21','msgSend',51,0,'Отправил сообщение'),(109,'2024-02-08 16:06:21','helperAssign',51,0,'Назначен куратор'),(110,'2024-02-08 16:06:21','msgSend',51,3,'Отправил сообщение'),(111,'2024-02-08 16:06:21','splitCreate',52,3,'Создал (сплит)'),(112,'2024-02-08 16:06:21','msgSend',52,0,'Отправил сообщение'),(113,'2024-02-08 16:06:21','helperAssign',52,0,'Назначен куратор'),(114,'2024-02-08 16:06:21','msgSend',52,3,'Отправил сообщение'),(115,'2024-02-08 16:06:21','statusChange',50,0,'Закрыл'),(116,'2024-02-08 16:09:25','helperAssign',51,53,'Изменил куратора'),(117,'2024-02-08 16:11:33','statusChange',51,3,'В работе'),(118,'2024-02-08 16:11:46','statusChange',51,3,'В работе'),(119,'2024-02-08 16:11:47','msgSend',51,3,'Отправил сообщение'),(120,'2024-02-08 16:11:56','assistantConn',51,2,'Подключен к диалогу'),(121,'2024-02-08 16:11:56','statusChange',51,0,'На уточнении'),(122,'2024-02-08 16:12:38','msgSend',51,3,'Отправил сообщение'),(123,'2024-02-08 16:13:34','msgSend',51,2,'Отправил сообщение'),(124,'2024-02-08 16:13:58','msgSend',51,3,'Отправил сообщение'),(125,'2024-02-08 16:14:08','assistantConn',51,2,'Отключен от диалога'),(126,'2024-02-08 16:14:08','statusChange',51,0,'В работе'),(127,'2024-02-08 16:16:24','statusChange',51,3,'В работе'),(128,'2024-02-08 16:16:24','msgSend',51,3,'Отправил сообщение'),(129,'2024-02-08 16:16:28','statusChange',51,3,'В работе'),(130,'2024-02-08 16:16:28','msgSend',51,3,'Отправил сообщение'),(131,'2024-02-08 16:16:31','statusChange',51,3,'Закрыл'),(132,'2024-02-08 17:12:15','create',53,4,'Создал'),(133,'2024-02-08 17:12:15','helperAssign',53,0,'Назначен куратор'),(134,'2024-02-08 17:12:15','msgSend',53,4,'Отправил сообщение'),(135,'2024-02-08 17:16:56','statusChange',53,3,'В работе'),(136,'2024-02-08 17:18:41','statusChange',53,3,'В работе'),(137,'2024-02-08 17:18:41','msgSend',53,3,'Отправил сообщение'),(138,'2024-02-08 17:19:00','statusChange',53,3,'Требует дополнения'),(139,'2024-02-08 17:19:00','msgSend',53,3,'Отправил сообщение'),(140,'2024-02-08 17:19:14','statusChange',53,3,'Требует дополнения'),(141,'2024-02-08 17:19:14','msgSend',53,3,'Отправил сообщение'),(142,'2024-02-08 17:19:19','statusChange',53,3,'Требует дополнения'),(143,'2024-02-08 17:19:19','msgSend',53,3,'Отправил сообщение'),(144,'2024-02-08 17:20:04','create',54,4,'Создал'),(145,'2024-02-08 17:20:04','helperAssign',54,0,'Назначен куратор'),(146,'2024-02-08 17:20:04','msgSend',54,4,'Отправил сообщение'),(147,'2024-02-08 17:21:09','msgSend',54,0,'Отправил сообщение'),(148,'2024-02-08 17:21:09','split',54,3,'Разделил'),(149,'2024-02-08 17:21:09','splitCreate',55,3,'Создал (сплит)'),(150,'2024-02-08 17:21:09','msgSend',55,0,'Отправил сообщение'),(151,'2024-02-08 17:21:09','helperAssign',55,0,'Назначен куратор'),(152,'2024-02-08 17:21:09','msgSend',55,3,'Отправил сообщение'),(153,'2024-02-08 17:21:09','splitCreate',56,3,'Создал (сплит)'),(154,'2024-02-08 17:21:09','msgSend',56,0,'Отправил сообщение'),(155,'2024-02-08 17:21:09','helperAssign',56,0,'Назначен куратор'),(156,'2024-02-08 17:21:09','msgSend',56,3,'Отправил сообщение'),(157,'2024-02-08 17:21:09','statusChange',54,0,'Закрыл'),(158,'2024-02-09 15:31:51','statusChange',46,3,'В работе'),(159,'2024-02-09 15:31:51','msgSend',46,3,'Отправил сообщение'),(160,'2024-02-09 15:32:28','statusChange',46,3,'В работе'),(161,'2024-02-09 15:32:28','msgSend',46,3,'Отправил сообщение'),(162,'2024-02-09 15:32:33','statusChange',46,3,'Закрыл'),(163,'2024-02-11 14:33:06','statusChange',56,3,'В работе'),(164,'2024-02-11 14:35:21','assistantConn',56,3,'Подключен к диалогу'),(165,'2024-02-11 14:35:21','statusChange',56,0,'На уточнении'),(166,'2024-02-12 16:02:06','statusChange',55,3,'В работе'),(167,'2024-02-12 16:05:39','statusChange',37,3,'В работе'),(168,'2024-02-12 16:05:57','assistantConn',37,3,'Подключен к диалогу'),(169,'2024-02-12 16:05:57','statusChange',37,0,'На уточнении'),(170,'2024-03-14 12:06:50','clientReaction',54,4,'Поставил оценку'),(179,'2024-03-20 19:22:13','create',61,1,'Создал'),(180,'2024-03-20 19:22:13','recipientChange',61,1,'Назначен адресат'),(181,'2024-03-20 19:22:13','msgSend',61,1,'Отправил сообщение'),(191,'2024-03-22 10:56:00','create',65,1,'Создал'),(192,'2024-03-22 10:56:00','recipientChange',65,0,'Назначен адресат'),(193,'2024-03-22 10:56:00','msgSend',65,1,'Отправил сообщение'),(196,'2024-03-22 11:01:26','create',67,1,'Создал'),(197,'2024-03-22 11:01:26','recipientChange',67,0,'Назначен адресат'),(198,'2024-03-22 11:01:26','msgSend',67,1,'Отправил сообщение'),(199,'2024-03-22 11:03:40','create',68,1,'Создал'),(200,'2024-03-22 11:03:40','recipientChange',68,0,'Назначен адресат'),(201,'2024-03-22 11:03:40','msgSend',68,1,'Отправил сообщение'),(204,'2024-03-22 19:59:32','msgSend',68,0,'Отправил сообщение'),(205,'2024-03-22 19:59:32','assistantConn',68,4,'Подключен к диалогу'),(206,'2024-03-22 19:59:32','statusChange',68,0,'Направил наставнику');
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
  `RU` varchar(512) NOT NULL,
  `EN` varchar(512) DEFAULT NULL,
  `ES` varchar(512) DEFAULT NULL,
  `CS` varchar(512) DEFAULT NULL,
  `BG` varchar(512) DEFAULT NULL,
  `DE` varchar(512) DEFAULT NULL,
  `HU` varchar(512) DEFAULT NULL,
  `KK` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=916 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translations`
--

LOCK TABLES `translations` WRITE;
/*!40000 ALTER TABLE `translations` DISABLE KEYS */;
INSERT INTO `translations` VALUES (556,'ticketStatus','TICKETSTATUS_7E7FC777A5840F50BA8E03A4B78ACA47','Новый','New','Nuevo',NULL,NULL,NULL,NULL,NULL),(557,'ticketStatus','TICKETSTATUS_1E9D7762BEDE1EE920BDB6FCFC6CF403','Закрыт','Closed','Cerrado',NULL,NULL,NULL,NULL,NULL),(558,'ticketStatus','TICKETSTATUS_B9C8AB323A26E59E41F56A62E1B4E5D1','В процессе','In progress','En curso',NULL,NULL,NULL,NULL,NULL),(559,'subTheme','SUBTHEME_3791FEF4A7B43F0667C784E1902F4DD5','Создание кошелька','Creating a wallet',NULL,NULL,NULL,NULL,NULL,NULL),(560,'subTheme','SUBTHEME_2FFD3D019ADB436A53191D91B2EAD5C6','Заявка на вывод токенов ','Application for the withdrawal of tokens',NULL,NULL,NULL,NULL,NULL,NULL),(561,'subTheme','SUBTHEME_27D3D0063AC3B364A3C1C03E4D91C351','Пополнение личного кабинета','Replenishment of the personal account',NULL,NULL,NULL,NULL,NULL,NULL),(562,'subTheme','SUBTHEME_D4404F2C27BD3E74B7D6D46BE3982208','Оплата заказа токенами','Payment of the order tokens',NULL,NULL,NULL,NULL,NULL,NULL),(563,'subTheme','SUBTHEME_466892FF57D7BD14D44DB226CB43777B','Не пришли токены по акции','Tokens did not come for the action',NULL,NULL,NULL,NULL,NULL,NULL),(564,'subTheme','SUBTHEME_195390D8958F2B5C58F5AE60A1F0A96D','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(565,'subTheme','SUBTHEME_DEDE99743C1EDDC0CD1DD53CEF647244','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(566,'subTheme','SUBTHEME_CDA6854D9A99F697F61C360E1B06DEC9','Заявка на вывод средств','Application for the withdrawal of funds',NULL,NULL,NULL,NULL,NULL,NULL),(567,'subTheme','SUBTHEME_BE33DF748F61F3E933C8EF8140265A73','Приобретение invest пакета','Acquisition of an Invest package',NULL,NULL,NULL,NULL,NULL,NULL),(568,'subTheme','SUBTHEME_1AB4B35179E42D4C85792732A1F7A9F1','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(569,'subTheme','SUBTHEME_856951C4DDFE9DB4B92800C0A2DC0F2E','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(570,'subTheme','SUBTHEME_0094CBABD8BA081F99A65818F2842B32','Изменение данных профиля','Changing the profile data',NULL,NULL,NULL,NULL,NULL,NULL),(571,'subTheme','SUBTHEME_CFF62E55D4CD5359C02688018B38E22E','Проблемы с доступом','Access problems',NULL,NULL,NULL,NULL,NULL,NULL),(572,'subTheme','SUBTHEME_B75EF765365340792F441E5A3D1954CE','Удаление личных данных','Removing personal data',NULL,NULL,NULL,NULL,NULL,NULL),(573,'subTheme','SUBTHEME_3AD1866AD8BF44DE49E6E9ED2AD238BE','Переоформление/передача ID номера','Renewal/transmission of ID numbers',NULL,NULL,NULL,NULL,NULL,NULL),(574,'subTheme','SUBTHEME_D433BFB31B8FB5A7121A732236D1E943','Подтверждение контактных данных','Confirmation of contact details',NULL,NULL,NULL,NULL,NULL,NULL),(575,'subTheme','SUBTHEME_BCD38D13C693168BA9CCB12830746F75','Изменение доверенного ЦО','Changing the trusted CO',NULL,NULL,NULL,NULL,NULL,NULL),(576,'subTheme','SUBTHEME_9F893128CB81C871D8701DB6383FBF09','Подтверждение Партнерского соглашения','Confirmation of the partner agreement',NULL,NULL,NULL,NULL,NULL,NULL),(577,'subTheme','SUBTHEME_AE71CA092765E64CAD45D6E504E57888','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(578,'subTheme','SUBTHEME_82BA4F94DCEF41AE3F1B6010A97ADAF4','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(579,'subTheme','SUBTHEME_9B0A22554460A2D1F00A9CE733640DBB','Выплата бонусов','Bonuses payment',NULL,NULL,NULL,NULL,NULL,NULL),(580,'subTheme','SUBTHEME_CAE57665EC55742A1D80D9BBB7203551','Начисление бонусов','Bonuses accrual',NULL,NULL,NULL,NULL,NULL,NULL),(581,'subTheme','SUBTHEME_F330B7610935D1415505529FD2E8704F','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(582,'subTheme','SUBTHEME_05BFDD79152E37FD099ECB8515E86923','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(583,'subTheme','SUBTHEME_1629C3DAB62AA9DDFE0E139E9D8534BA','Информация О Продукте','Product information',NULL,NULL,NULL,NULL,NULL,NULL),(584,'subTheme','SUBTHEME_6A9985B5567A85DEAF05D89AB1B4DAD6','Наличие Продукции','The availability of products',NULL,NULL,NULL,NULL,NULL,NULL),(585,'subTheme','SUBTHEME_6933ED63E4BE6E7416DCEC5E6FD47EB7','Контроль качества','Quality control',NULL,NULL,NULL,NULL,NULL,NULL),(586,'subTheme','SUBTHEME_2C0C943306B7B8134D91AEDA3AC440EB','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(587,'subTheme','SUBTHEME_F75BD25198806C485AC7937DAAC59CE5','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(588,'subTheme','SUBTHEME_41E44D29CA57B3DCBCF861507AAD3D11','Не верно указан адрес','The address is not correctly indicated',NULL,NULL,NULL,NULL,NULL,NULL),(589,'subTheme','SUBTHEME_2F3CB3228C032D52338C6508C3946798','Изменить получателя','Change the recipient',NULL,NULL,NULL,NULL,NULL,NULL),(590,'subTheme','SUBTHEME_9A18545D2F01FE8FF450D2C1594BAF3A','Заказ не получен','The order was not received',NULL,NULL,NULL,NULL,NULL,NULL),(591,'subTheme','SUBTHEME_EBC51780F5BB7D03E6BEF01D7DB2D377','Заказ пришел не в том объёме','The order came to the wrong amount',NULL,NULL,NULL,NULL,NULL,NULL),(592,'subTheme','SUBTHEME_BA8646B918511048A7ECC4102BDEAE9B','Товар пришёл поврежденным','The goods came damaged',NULL,NULL,NULL,NULL,NULL,NULL),(593,'subTheme','SUBTHEME_D2957B752D574C0FC1337F602C8EE9CE','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(594,'subTheme','SUBTHEME_B64BC46C5F9B878A84D52BCCC0F3F048','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(595,'subTheme','SUBTHEME_C48C34B64F9D543732BE24D52D4B0286','Не выбрал подарочный продукт','Did not choose a gift product',NULL,NULL,NULL,NULL,NULL,NULL),(596,'subTheme','SUBTHEME_4FA586BC9999E3CC571CB5256E7CACFE','Отмена заказа','Cancellations',NULL,NULL,NULL,NULL,NULL,NULL),(597,'subTheme','SUBTHEME_BFE65E656AC4B69828052BA0DF6F5393','Списать бонусы в счёт оплаты заказа','Write off bonuses on the order payment account',NULL,NULL,NULL,NULL,NULL,NULL),(598,'subTheme','SUBTHEME_7DB13BA1488118A5CF5288417ED6F7C4','Не проходит оплата','Payment does not pass',NULL,NULL,NULL,NULL,NULL,NULL),(599,'subTheme','SUBTHEME_F6266D55C8143A82E628DB1B2160B83A','Не верно указал адрес','Did not correctly indicate the address',NULL,NULL,NULL,NULL,NULL,NULL),(600,'subTheme','SUBTHEME_BC102C098E5ADD9A1A38DC9A2D50B778','Изменить получателя','Change the recipient',NULL,NULL,NULL,NULL,NULL,NULL),(601,'subTheme','SUBTHEME_7C254E0A037011015A3D0DCF65EA8224','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(602,'subTheme','SUBTHEME_36553BE76B68C2E0216D110D69B248F5','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(603,'subTheme','SUBTHEME_E09BBE3DB9FF2672931946CE8A00E32D','Консультация по условиям Акции','Consultation on the terms of the promotion',NULL,NULL,NULL,NULL,NULL,NULL),(604,'subTheme','SUBTHEME_95083C84EBDB452FFE465F8AFAFF1CDF','Не получил подарок по Акции','Did not receive a gift for a promotion',NULL,NULL,NULL,NULL,NULL,NULL),(605,'subTheme','SUBTHEME_30AAECCFAD74E17E43D0069E3C686342','Не пришли токены по акции','Did not receive a gift for a promotion',NULL,NULL,NULL,NULL,NULL,NULL),(606,'subTheme','SUBTHEME_7FA72A154EFA8BBE2C6B26A80F94B690','Путешествия','Trips',NULL,NULL,NULL,NULL,NULL,NULL),(607,'subTheme','SUBTHEME_73B9F4FE23FDA000CAC8AF69BF0F793A','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(608,'subTheme','SUBTHEME_5D599EA92F1ADF2ECC9E29ED08A14B9F','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(609,'subTheme','SUBTHEME_1872F37824438B45EEBA91A29C1F8CE3','Вопрос по квалификации','Question on qualification',NULL,NULL,NULL,NULL,NULL,NULL),(610,'subTheme','SUBTHEME_7302DB94A9A9B0ECEF401908266F9FF6','WR Club 200+','WR Club 200+',NULL,NULL,NULL,NULL,NULL,NULL),(611,'subTheme','SUBTHEME_B8EEF7D148D43BE9829E51BB2E9C04F7','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(612,'subTheme','SUBTHEME_09409BBB92115518E7FB968D2BD5370C','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(613,'subTheme','SUBTHEME_C3D2EB60ECC621066473D3F57E156F79','Коррекция по бинару','Binar correction',NULL,NULL,NULL,NULL,NULL,NULL),(614,'subTheme','SUBTHEME_2DB0E2C93EC649B52FA744F784BCA9D7','Коррекция Наставника','Correction of a mentor',NULL,NULL,NULL,NULL,NULL,NULL),(615,'subTheme','SUBTHEME_5880754A7F37557387991A21F68FFD19','Коррекция бинарного статуса','Correction of binary status',NULL,NULL,NULL,NULL,NULL,NULL),(616,'subTheme','SUBTHEME_F364B6F5BEE237B2AF3D798CBBA58178','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(617,'subTheme','SUBTHEME_F0ABB7FFBD78CA49BDFA9EDE8D828759','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(618,'subTheme','SUBTHEME_D9E296D403363B8E28A83A49CBEDCE4B','Уточнение деталей','Clarification of details',NULL,NULL,NULL,NULL,NULL,NULL),(619,'subTheme','SUBTHEME_532B3C1C4548CBC7AD08358F7EDCC3B3','Уведомление о системной ошибке','System error notification',NULL,NULL,NULL,NULL,NULL,NULL),(620,'subTheme','SUBTHEME_09D6FCD707A52B03CAC70622BAAA969C','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(621,'subTheme','SUBTHEME_F178AF36EF770E7472E1BF3BA9A4F628','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(622,'subTheme','SUBTHEME_75ED71CAB0FCA5D6EFC5413067176EE8','Вопросы по сайту','Questions on the site',NULL,NULL,NULL,NULL,NULL,NULL),(623,'subTheme','SUBTHEME_6A34C9DDD2A387FEB3A2B741126F3B28','Открытие Центра Обслуживания','Opening of the service center',NULL,NULL,NULL,NULL,NULL,NULL),(624,'subTheme','SUBTHEME_DF5EE7BB4A607B52AE356F1EC96AC4BB','Международные Рынки','International markets',NULL,NULL,NULL,NULL,NULL,NULL),(625,'subTheme','SUBTHEME_00521848B6FDCE2DB2B6DE43AD8DF4C1','Этический кодекс','Ethical Code',NULL,NULL,NULL,NULL,NULL,NULL),(626,'subTheme','SUBTHEME_814E983A7A42311B40000316CD6FEA66','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(627,'subTheme','SUBTHEME_E86D2CDBD946D92B81FCA31CC316C51F','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(628,'subTheme','SUBTHEME_F5FBF9A28B69BEA951615C723C1B5814','Поиск Информации','Search for information',NULL,NULL,NULL,NULL,NULL,NULL),(629,'subTheme','SUBTHEME_1551AAD11A91FEE8CB86A619798F5802','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(630,'subTheme','SUBTHEME_8199F66DC6A0CF5238875AD93E3216A3','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(631,'subTheme','SUBTHEME_DAF14AD3D2A51FF595143EB11C6058CA','none','none',NULL,NULL,NULL,NULL,NULL,NULL),(632,'subTheme','SUBTHEME_1FA7F8484D6740A5A6861BE059398C2A','none','none',NULL,NULL,NULL,NULL,NULL,NULL),(633,'subTheme','SUBTHEME_73450E5BC0BF9FDD5DA8FCC983711948','none','none',NULL,NULL,NULL,NULL,NULL,NULL),(634,'subTheme','SUBTHEME_9F4A994E4156B5B3C0F4E0A4297F929E','Открыть продукты на ЦО','Open products on the central',NULL,NULL,NULL,NULL,NULL,NULL),(635,'subTheme','SUBTHEME_5F87183289F736EDD8C858F8E6F8AC5B','Закрыть продукты на ЦО','Close products on the central',NULL,NULL,NULL,NULL,NULL,NULL),(636,'subTheme','SUBTHEME_FC76E6FB2C7FB229E7A004DA31BB7614','Контроль качества','Quality control',NULL,NULL,NULL,NULL,NULL,NULL),(637,'subTheme','SUBTHEME_08BC30B7560FB30D7C8706906D211911','Информация О Продукте','Product information',NULL,NULL,NULL,NULL,NULL,NULL),(638,'subTheme','SUBTHEME_32C9FA2A341E8A2242F539C547108CBD','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(639,'subTheme','SUBTHEME_4B0F821A9F01F151086F3ECE9463D3D9','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(640,'subTheme','SUBTHEME_C897E225C83FE39AD6FEDAAF3B000D18','Выставление счёта','Invoicing',NULL,NULL,NULL,NULL,NULL,NULL),(641,'subTheme','SUBTHEME_4F085E17BB0F40A975F3340479F68DBF','Акты','Acts',NULL,NULL,NULL,NULL,NULL,NULL),(642,'subTheme','SUBTHEME_DF145A7CB0E0E053C2CDC14D2ADA2C65','Выплата дохода','Payment of income',NULL,NULL,NULL,NULL,NULL,NULL),(643,'subTheme','SUBTHEME_4DD085E409A74CDF15F95BAC32F6D739','Начисление дохода','Accrual of income',NULL,NULL,NULL,NULL,NULL,NULL),(644,'subTheme','SUBTHEME_57B07F24A750F423F43266BCC9EE9F95','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(645,'subTheme','SUBTHEME_5B344D5390826BBCD17E9C1E4420B571','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(646,'subTheme','SUBTHEME_DFDD3F844F1351790CE078D00E34BF9E','Наличие продукции','The availability of products',NULL,NULL,NULL,NULL,NULL,NULL),(647,'subTheme','SUBTHEME_5DF5056C148DCDF0E0D160F706AE2A43','Пересорт','Regrading',NULL,NULL,NULL,NULL,NULL,NULL),(648,'subTheme','SUBTHEME_ED9F431D13C117D4C5CFF2034D214EDD','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(649,'subTheme','SUBTHEME_5CB1DFDF3B3F45575979842827ACC514','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(650,'subTheme','SUBTHEME_1B6FE7554739FBB467BEC2B73C9BE2BA','Изменение состава заказа','Changing the composition of the order',NULL,NULL,NULL,NULL,NULL,NULL),(651,'subTheme','SUBTHEME_79C879A54F974EFAA7B545BA9DFFCEDA','Списание','Charge-off',NULL,NULL,NULL,NULL,NULL,NULL),(652,'subTheme','SUBTHEME_03BCBA2234CA2F7BE1A4B72EF7BC5D84','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(653,'subTheme','SUBTHEME_631ACA7E6C1B50D33F281113053B1497','Акт сверки','Act of reconciliation',NULL,NULL,NULL,NULL,NULL,NULL),(654,'subTheme','SUBTHEME_5E6E501687DB8A8A0FD85ECCF31AAC7D','Инвентаризация','Inventory',NULL,NULL,NULL,NULL,NULL,NULL),(655,'subTheme','SUBTHEME_37E89DD02724B49C20B1D466C3E51D20','Договор','Contract',NULL,NULL,NULL,NULL,NULL,NULL),(656,'subTheme','SUBTHEME_81A0D424C89CE99616AB3C3F6EB1C74D','Контакты','Contacts',NULL,NULL,NULL,NULL,NULL,NULL),(657,'subTheme','SUBTHEME_78BF8C1DE2666BBA06AD753197005202','Товарные лимиты','Commodity limits',NULL,NULL,NULL,NULL,NULL,NULL),(658,'subTheme','SUBTHEME_1F09F9D3822379F893845DB02F7658C4','Прочие вопросы','Other questions',NULL,NULL,NULL,NULL,NULL,NULL),(659,'subTheme','SUBTHEME_177511656D886BA7856EB83981CF6F02','Пожелания и предложения','Suggestions and proposals',NULL,NULL,NULL,NULL,NULL,NULL),(660,'subTheme','SUBTHEME_232CA03AE0637D05C316595CBF640D2E','none','none',NULL,NULL,NULL,NULL,NULL,NULL),(661,'subTheme','SUBTHEME_271CA31E7FCEDB52FFC276D808461A18','none','none',NULL,NULL,NULL,NULL,NULL,NULL),(662,'theme','THEME_EDB3F5C0C392DF7F86A0358270BDE0E0','WRT Токены','WRT tokens',NULL,NULL,NULL,NULL,NULL,NULL),(663,'theme','THEME_D0C4D0A6021EDC13E8149B07BE2304F4','Платформа D-INVEST','D-Invest platform',NULL,NULL,NULL,NULL,NULL,NULL),(664,'theme','THEME_C00FAF9F4A096FBD1171E05FA51C00D7','Личные данные','Personal data',NULL,NULL,NULL,NULL,NULL,NULL),(665,'theme','THEME_85DD5017C62149565B909B1341A62EDB','Бонусные вознаграждения','Bonus rewards',NULL,NULL,NULL,NULL,NULL,NULL),(666,'theme','THEME_3C2D2829736172255113FF2A2D16D2D5','Вопросы по продукции','Questions about products',NULL,NULL,NULL,NULL,NULL,NULL),(667,'theme','THEME_5F7249CB662E88CC370B52273D873EC8','Доставка заказа (отправленный)','Order delivery (sent)',NULL,NULL,NULL,NULL,NULL,NULL),(668,'theme','THEME_9322CD7D3A2CBCAEF4DF26D56272AA7B','Изменение заказа (не отправленный)','Changing the order (not sent)',NULL,NULL,NULL,NULL,NULL,NULL),(669,'theme','THEME_6FC86E481C945C253298F5E8EDA1F7A2','Акции','Stock',NULL,NULL,NULL,NULL,NULL,NULL),(670,'theme','THEME_0C63C3BC3483C71F249BE17C66AEA6FA','Признания достижений','Recognition of achievements',NULL,NULL,NULL,NULL,NULL,NULL),(671,'theme','THEME_FDE95BC2F0C449D0E70C489215D8EBD9','Ошибка в структуре','An error in the structure',NULL,NULL,NULL,NULL,NULL,NULL),(672,'theme','THEME_51B1143794A571DE66866BEFC03A49F9','Маркетинг план','Marketing Plan',NULL,NULL,NULL,NULL,NULL,NULL),(673,'theme','THEME_286EB35B8608DF561F9CBC460B85CCCC','Вопросы по ведению бизнеса','Business issues',NULL,NULL,NULL,NULL,NULL,NULL),(674,'theme','THEME_2BB3E5D9E8F7BBFF2273F358E3F4542B','Общие вопросы о компании','General questions about the company',NULL,NULL,NULL,NULL,NULL,NULL),(675,'theme','THEME_74AD89D3BCF2883654054BD2BC6BA62D','Прочие вопросы и предложения','Other questions and suggestions',NULL,NULL,NULL,NULL,NULL,NULL),(676,'theme','THEME_E54210E8790DFAA86ADD8A7499B81342','Открытие Центра Обслуживания','Opening of the service center',NULL,NULL,NULL,NULL,NULL,NULL),(677,'theme','THEME_599F5335BC00A1A965AD812265112C78','Оформление офиса','Office design',NULL,NULL,NULL,NULL,NULL,NULL),(678,'theme','THEME_DB9A04D8A5C3F8ECB78D92D9A5CCC307','Продукты','Products',NULL,NULL,NULL,NULL,NULL,NULL),(679,'theme','THEME_56F572513B8C5C785BABF5959CF359FF','Финансы','Finance',NULL,NULL,NULL,NULL,NULL,NULL),(680,'theme','THEME_57326D97A62056551CA14BB256FD9189','Поставка','Supply',NULL,NULL,NULL,NULL,NULL,NULL),(681,'theme','THEME_1A7CA3DC597DB324319DB7B11C545808','Корректировка остатков','Correction of residues',NULL,NULL,NULL,NULL,NULL,NULL),(682,'theme','THEME_87BD9A7DFA1FD029A003BB6BD2DE072C','Изменение данных','Data change',NULL,NULL,NULL,NULL,NULL,NULL),(683,'theme','THEME_18B7E833D77E8B0866831D122ED0A077','Закрытие офиса','Closing the office',NULL,NULL,NULL,NULL,NULL,NULL),(684,'theme','THEME_9B4B27D49326F87DA1493DC1A29FE749','Прочие вопросы и предложения','Other questions and suggestions',NULL,NULL,NULL,NULL,NULL,NULL),(685,'unit','UNIT_38F4B792367665ECAB510E7236BEB3E4','Партнерам/Клиентам','Partners/clients',NULL,NULL,NULL,NULL,NULL,NULL),(686,'unit','UNIT_F91F5720E82A6C4D0257651298C590A9','Держателям офиса','Office holders',NULL,NULL,NULL,NULL,NULL,NULL),(698,'department','DEPARTMENT_00E6366DE7FF2B8FC1180C3C732D80BA','Оперативная поддержка','Hotline',NULL,NULL,NULL,NULL,NULL,NULL),(699,'department','DEPARTMENT_1AFF8F579BDDD54765F6D5DA364B508E','Поддержка ЦО','Support TSO',NULL,NULL,NULL,NULL,NULL,NULL),(701,'department','DEPARTMENT_C830262C8B0BF3015EFC660B25CD026D','Вершинин','Vershinin',NULL,NULL,NULL,NULL,NULL,NULL),(702,'jobTitle','JOBTITLE_018D3A9B770D07CB1522BFBC49C17CAF','Администратор','Administrator',NULL,NULL,NULL,NULL,NULL,NULL),(703,'jobTitle','JOBTITLE_D5D256B6C64C7A6C438CCF90FD624B7F','Куратор','Curator',NULL,NULL,NULL,NULL,NULL,NULL),(704,'jobTitle','JOBTITLE_D3EA4DDD8FADFEC6A6C129E7ADB8C609','Руководитель','Supervisor',NULL,NULL,NULL,NULL,NULL,NULL),(709,'country','COUNTRY_DA68DD4FBC33438825D655343295525C','Россия','Russia',NULL,NULL,NULL,NULL,NULL,NULL),(710,'country','COUNTRY_7B880D1109031A03655B66ACD0C780FD','Англия','Iran',NULL,NULL,NULL,NULL,NULL,NULL),(711,'country','COUNTRY_5D68AC73CB08553D8DF7A4D1B4DC97A7','Испания','Poland',NULL,NULL,NULL,NULL,NULL,NULL),(712,'country','COUNTRY_6D095FF6963E42901E8DB74D905548A3','Чехия','China',NULL,NULL,NULL,NULL,NULL,NULL),(713,'country','COUNTRY_CD8019F57C74BDD3556858914C505ED5','Болгария','Japan',NULL,NULL,NULL,NULL,NULL,NULL),(721,'ticketStatus','TICKETSTATUS_08F55006CF2D6B8E04B9A6A6929DAD22','На уточнении','On clarification','Bajo aclaración',NULL,NULL,NULL,NULL,NULL),(722,'ticketStatus','TICKETSTATUS_9F8568BC05C18BBB6AD1F08E9E2FE940','Ожидает дополнения','Waiting for additions','En espera de adiciones',NULL,NULL,NULL,NULL,NULL),(723,'interface','INTERFACE_ERROR','Что-то пошло не так','Something went wrong','Algo salió mal','Něco se pokazilo','Нещо се обърка','Etwas ist schief gelaufen','Valami elromlott','Бірдеңе дұрыс болмады'),(724,'interface','INTERFACE_MY_APPEALS','Мои обращения','My appeals','Mis apelaciones','Moje výzvy','Моите жалби','Meine Berufungen','Fellebbezéseim','Менің өтініштерім'),(725,'interface','INTERFACE_ALL_APPEALS','Все обращения','All appeals','Todas las apelaciones','Všechna odvolání','Всички обжалвания','Alle Berufungen','Minden fellebbezés','Барлық өтініштер'),(726,'interface','INTERFACE_SORT','Сортировать по','Sort by','Ordenar por','Seřazeno podle','Сортиране от','Sortiere nach','Rendezés','Бойынша сұрыптау'),(727,'interface','INTERFACE_CHAPTER','Раздел','Chapter','Apartado','Kapitola','Глава','Kapitel','Fejezet','Бөлім'),(728,'interface','INTERFACE_DATE','Дата','date','fecha','datum','дата','Datum','dátum','дата'),(729,'interface','INTERFACE_THEME','Тема','Subject','Tema','Předmět','Предмет','Thema','Tantárgy','Душар қылу'),(730,'interface','INTERFACE_LAST_MSG','Последнее сообщение','Last message','Ultimo mensaje','Poslední zpráva','Последно съобщение','Letzte Nachricht','Utolsó üzenet','Хабар'),(731,'interface','INTERFACE_DATE_CREATE','Дата создания','date of creation','fecha de creación','datum vytvoření','Дата на създаване','Erstelldatum','A teremtés dátuma','Жасалған күн'),(734,'interface','INTERFACE_MSG','Сообщений','Messages','Los mensajes','Zprávy','Съобщения','Mitteilungen','üzenetek','Хабарлар'),(735,'interface','INTERFACE_STATUS','Статус','Status','Estado','Postavení','Статус','Status','Állapot','Мәртебе'),(736,'interface','INTERFACE_SHOW_FILTER','Показать фильтр','Show the filter','Mostrar el filtro','Zobrazit filtr','Покажете филтъра','Zeigen Sie den Filter','Mutasd meg a szűrőt','Сүзгіні көрсетіңіз'),(737,'interface','INTERFACE_HIDE_FILTER','Скрыть фильтр','Hide the filter','Ocultar filtro','Skrýt filtr','Скрийте филтъра','Den Filter verstecken','Elrejteni a szűrőt','Сүзгіні жасырыңыз'),(738,'interface','INTERFACE_SELECT_UNIT','Выберите подразделение','Select the unit','Seleccionar departamento','Vyberte jednotku','Изберете устройството','Wählen Sie das Gerät aus','Válassza ki az egységet','Құрылғыны таңдаңыз'),(739,'interface','INTERFACE_TYPE_APPEALS','Тип обращения','Type of circulation','Tipo de apelación','Typ oběhu','Вид циркулация','Art der Verbreitung','Keringés típusa','Айналым түрі'),(740,'interface','INTERFACE_SUBTHEME','Подтема','Substeum','Subtema','Substaum','Substeum','Sekundenzeichen','Alcsoport','Жиынтық'),(741,'interface','INTERFACE_CURATOR','Куратор','Curator','Curador','Kurátor','Куратор','Kurator','Kurátor','Куратор'),(742,'interface','INTERFACE_CURATORS_COUNTRY','Страны кураторов','Curators\' countries','Países de los curadores','Země kurátorů','Страните на кураторите','Kuratorenländer','Kurátorok országai','Кураторлар елдері'),(743,'interface','INTERFACE_PARTNERS_COUNTRY','Страны партнёров','Partners\' countries','Países de los socios','Země partnerů','Страните на партньорите','Partnerländer','Partnerek országai','Серіктестер елдері'),(744,'interface','INTERFACE_SET_PERIOD','Задать период','Set the period','Establecer el período','Nastavit období','Задайте периода','Setzen Sie die Periode','Állítsa be a periódust','Кезеңді орнатыңыз'),(745,'interface','INTERFACE_REACTIONS','Реакции','Reactions','Reacciones','Reakce','Реакции','Reaktionen','Reakció','Реакциялар'),(746,'interface','INTERFACE_REG_EXP','Есть слова','There are words','Hay palabras','Existují slova','Има думи','Es gibt Worte','Vannak szavak','Сөздер бар'),(747,'interface','INTERFACE_THEME_STATUS','Статус темы','Topic status','Estado del tema','Stav tématu','Статус на темата','Themenstatus','Téma állapota','Тақырып күйі'),(748,'interface','INTERFACE_CREATE_MORE','Создано более чем','More than more than','Creados más de','Více než více než','Повече от повече от','Mehr als mehr als mehr als','Több, mint','Одан да көп'),(749,'interface','INTERFACE_DAY_AGO','X дней назад','X days ago','Hace X días','Před x dny','Преди дни','X Tage','X nappal ezelőtt','X күн бұрын'),(750,'interface','INTERFACE_TIME','минут/часов/дней','minutes/hours/days','minutos/horas/días','minut/hodiny/dny','Минути/часове/дни','Minuten/Stunden/Tage','perc/óra/nap','минут / сағат / күндер'),(752,'interface','INTERFACE_STRUCTURE','Структура','Structure','Estructura','Struktura','Структура','Struktur','Szerkezet','Құрылым'),(753,'interface','INTERFACE_ID_NUMBER','Номер ID','ID number','Número de ID','identifikační číslo','Идентификационен номер','ID -Nummer','személyi igazolvány száma','ID нөмірі'),(754,'interface','INTERFACE_APPLY','Применить','Apply','Aplicar','Aplikovat','Приложи','Anwenden','Alkalmaz','Өтініш беру'),(755,'interface','INTERFACE_RESET','Сбросить','Reset','Reiniciar','Resetovat','Нулиране','Zurücksetzen','Visszaállítás','Ысыру'),(756,'interface','INTERFACE_MY_TICKETS','Мои тикеты','My ticks','Mis apelaciones','Moje klíšťata','Моите кърлежи','Meine Zecken','Kullancsom','Менің кенелерім'),(757,'interface','INTERFACE_ALL_TICKETS','Все тикеты','All ticks','Todas las apelaciones','Všechna klíšťata','Всички кърлежи','Alle Zecken','Minden kullancs','Барлық кенелер'),(758,'interface','INTERFACE_IN_PROCESS','В процессе рассмотрения','In the process of consideration','En el proceso de consideración','V procesu zvážení','В процеса на разглеждане','Im Rahmen der Prüfung','A megfontolás folyamatában','Қарау барысында'),(760,'interface','INTERFACE_TICKET_CREATOR','Создатель обращения','Creator of appeal','Creador de apelación','Stvořitel odvolání','Създател на обжалване','Schöpfer der Berufung','A fellebbezés alkotója','Апелляция жасаушы'),(761,'interface','INTERFACE_CURRENT_CURATOR','Текущий куратор','Current curator','Curador actual','Aktuální kurátor','Текущ куратор','Stromkurator','Aktuális kurátor','Қазіргі куратор'),(762,'interface','INTERFACE_NAME','Имя','Name','Nombre','název','Име','Name','Név','Есім'),(763,'interface','INTERFACE_SURNAME','Фамилия','Surname','Primer apellido','Příjmení','Фамилно име','Nachname','Vezetéknév','Тегі'),(764,'interface','INTERFACE_PATRONYMIC','Отчество','Patronymic','Segundo apellido','Příjmení','Фамилно име','Nachname','Vezetéknév','Тегі'),(766,'interface','INTERFACE_EVENT','Событие','Event','Evento','událost','Събитие','Ereignis','Esemény','Оқиға'),(767,'interface','INTERFACE_TICKETS','Тикеты','Taket','Apelaciones','Taket','Taket','Taket','Vétel','Тегет'),(768,'interface','INTERFACE_STATS','Статистика','Statistics','Estadísticas','Statistika','Статистика','Statistiken','Statisztika','Статистика'),(769,'interface','INTERFACE_CURATORS','Кураторы','Curators','Curadores','Kurátoři','Куратори','Kuratoren','Kurátorok','Курторлар'),(770,'interface','INTERFACE_THEMES','Темы','Themes','Temas','Témata','Теми','Themen','Témák','Тақырыптар'),(771,'interface','INTERFACE_SUBTHEMES','Подтемы','Supplies','Subtemas','Zásoby','Доставки','Lieferungen','Készletek','Жабдықтар'),(772,'interface','INTERFACE_UNITS','Подразделения','Units','Apartados','Jednotky','Единици','Einheiten','Egységek','Қондырғылары'),(773,'interface','INTERFACE_LOG_OUT','Выйти','Go out','Salir','Jít ven','Излез','Hinausgehen','Eljár szórakozni','Шығу'),(774,'interface','INTERFACE_LOG_IN','Войти','To come in','Entrar','Vejít do','Да вляза','Betreten','Bejönni','Кіру'),(775,'interface','INTERFACE_UNNAMED','Без названия','Untitled','Sin título','Nepojmenovaná','Без заглавие','Untitled','Névtelen','атаусыз'),(776,'interface','INTERFACE_SHOW_ALL_TICKETS','Показать все обращения','Show all appeals','Mostrar todas las apelaciones','Ukázat všechny odvolání','Покажете всички обжалвания','Zeigen Sie alle Berufungen','Mutasd meg az összes fellebbezést','Барлық өтініштерді көрсету'),(777,'interface','INTERFACE_ALL_CURATORS','Все кураторы','All curators','Todos los curadores','Všichni kurátoři','Всички куратори','Alle Kuratoren','Minden kurátor','Барлық кураторлар'),(778,'interface','INTERFACE_FULL_NAME','ФИО','Full name','Nombre completo','Celé jméno','Пълно име','Vollständiger Name','Teljes név','Толық аты'),(779,'interface','INTERFACE_DATE_OF_BIRTHDAY','Дата рождения','Date of Birth','Fecha de nacimiento','Datum narození','Дата на раждане','Geburtsdatum','Születési dátum','туған күні'),(780,'interface','INTERFACE_TOOK_OFFICE','Вступил в должность','He took office','Asumió el cargo','Nastoupil do úřadu','Той встъпи в длъжност','Er nahm sein Amt','Hivatalba lépett','Ол кеңсе алды'),(781,'interface','INTERFACE_EDIT','Редактировать','Edit','Editar','Upravit','редактиране','Bearbeiten','Szerkeszt','Редакциялау'),(782,'interface','INTERFACE_ADD_CURATOR','Добавить куратора','Add the curator','Agrega el curador','Přidejte kurátora','Добавете куратора','Fügen Sie den Kurator hinzu','Adja hozzá a kurátort','Кураторды қосыңыз'),(783,'interface','INTERFACE_DELETE_CURATOR','Удалить куратора','Delete the curator','Eliminar el curador','Odstraňte kurátora','Изтрийте куратора','Den Kurator löschen','Törölje a kurátort','Кураторды жойыңыз'),(784,'interface','INTERFACE_COUNTRY','Страна','A country','País','Země','Страна','Ein Land','Egy ország','Мемлекет'),(785,'interface','INTERFACE_DEPARTAMENTS','Департаменты','Departments','Departamentos','Oddělení','Отдели','Abteilungen','Osztályok','Бөлімдер'),(786,'interface','INTERFACE_JOB','Должность','Job title','Título profesional','Pracovní pozice','Длъжност','Berufsbezeichnung','Munka megnevezése','Қызмет атауы'),(787,'interface','INTERFACE_ADD_THEME','Добавить тему','Add the topic','Agregar un tema','Přidejte téma','Добавете темата','Fügen Sie das Thema hinzu','Adja hozzá a témát','Тақырыпты қосыңыз'),(788,'interface','INTERFACE_GO_TO_THEMES','Перейти к темам','Go to topics','Ir a temas','Přejít na témata','Отидете на теми','Gehen Sie zu Themen','Menj a témákba','Тақырыптарға барыңыз'),(789,'interface','INTERFACE_GO_TO_UNITS','Перейти к разделам','Go to sections','Ir a apartados','Přejít na sekce','Отидете на секции','Gehen Sie zu Abschnitten','Menj a szakaszokba','Бөлімдерге барыңыз'),(790,'interface','INTERFACE_GO_TO_SUBTHEMES','Перейти к подтемам','Go to the subtrams','Ir a subtemas','Přejít na podřízené','Отивам в подтрамките','In die Subtams gehen','Menj az alutamrákhoz','Субсидтерге барыңыз'),(791,'interface','INTERFACE_ORDER','Порядок','Order','Orden','Objednat','Поръчка','Befehl','Rendelés','Тапсырыс'),(792,'interface','INTERFACE_NAME_OF_UNIT','Название подразделения','The name of the unit','El nombre del apartado','Název jednotky','Името на устройството','Der Name der Einheit','Az egység neve','Құрылғының атауы'),(793,'interface','INTERFACE_START_WORK','Начать работу','Start work','Empezar a trabajar','Začít pracovat','Започвам работа','Fang an zu arbeiten','Munkát elkezdeni','Жұмысты бастау'),(794,'interface','INTERFACE_EDIT_TICKET','Изменить тикет','Change the Ticket','Cambiar la apelación','Změňte lístek','Променете билета','Ändern Sie das Ticket','Változtassa meg a jegyet','Билетті өзгерту'),(795,'interface','INTERFACE_SPLIT_TICKET','Разделить тикет','Divide the Ticket','Dividir la apelación','Rozdělte lístek','Разделете билета','Teilen Sie das Ticket auf','Ossza meg a jegyet','Билетті бөліңіз'),(796,'interface','INTERFACE_DENY_WRITE','Запретить писать клиенту','Forbid to write to the client','Impedir que el cliente escriba','Zakazujte psát klientovi','Забранявайте да пишете на клиента','Verbieten, dem Kunden zu schreiben','Tiltsa, hogy írjon az ügyfélnek','Клиентке жазуға тыйым салыңыз'),(797,'interface','INTERFACE_ACCESS_WRITE','Разрешить писать клиенту','Allow to write to the client','Permitir que el cliente escriba','Nechte psát klientovi','Позволете да пишете на клиента','Erlauben Sie dem Kunden zu schreiben','Hagyja, hogy írjon az ügyfélnek','Клиентке жазуға рұқсат етіңіз'),(798,'interface','INTERFACE_SEND','Отправить','Send','Enviar','Poslat','Изпратете','Schicken','Küld','Жіберу'),(799,'interface','INTERFACE_CLOSE_TICKET','Закрыть заявку','Close the application','Cerrar el pedido','Zavřete aplikaci','Затворете приложението','Schließen Sie die Anwendung','Zárja be az alkalmazást','Қолданбаны жабыңыз'),(801,'interface','INTERFACE_ADD_FILE','Добавить файл','add file','agregar archivo','přidat soubor','добави файл','Datei hinzufügen','fájl hozzáadása','Файл қосу'),(802,'interface','INTERFACE_FILE_NOT_SELECT','Файл не выбран','The file is not selected','El archivo no está seleccionado','Soubor není vybrán','Файлът не е избран','Die Datei ist nicht ausgewählt','A fájl nincs kiválasztva','Файл таңдалмаған'),(803,'interface','INTERFACE_CHOOSE_FILE','Выберите файл','Choose File','Seleccionar un archivo','Vyberte soubor','Изберете файл','Datei wählen','Válassz fájlt','Файлды таңдаңыз'),(804,'interface','INTERFACE_ENTER_MSG','Введите здесь ваше сообщение','Enter your message here','Introduzca aquí su mensaje','Zde zadejte svou zprávu','Въведете вашето съобщение тук','Geben Sie hier Ihre Nachricht ein','Írja be az üzenetét ide','Хабарламаңызды осы жерге енгізіңіз'),(805,'interface','INTERFACE_EDIT_THEME','Редактировать тему','Edit the topic','Editar el tema','Upravit téma','Редактирайте темата','Bearbeiten Sie das Thema','Szerkessze a témát','Тақырыпты өңдеңіз'),(806,'interface','INTERFACE_CHANGE_CURATOR','Изменить куратора','Change the curator','Cambiar el curador','Změňte kurátora','Променете куратора','Ändern Sie den Kurator','Változtassa meg a kurátort','Кураторды өзгертіңіз'),(807,'interface','INTERFACE_SEPARATION_OF_TICKET','Разделение тикета','Separation of a tiket','División de la apelación','Oddělení tiketu','Разделяне на тикет','Trennung eines Tiket','Egy tiket elválasztása','Тикет бөлінуі'),(808,'interface','INTERFACE_NUMBER_OF_NEW_TICKET','Количество новых тикетов','The number of new tikets','El número de nuevos tikets','Počet nových Tiketů','Броят на новите тикове','Die Anzahl der neuen Tikets','Az új tiketek száma','Жаңа тикеттердің саны'),(809,'interface','INTERFACE_CREATE_NEW_TICKET','Создать новые тикеты','Create new ticks','Crear nuevas apelaciones','Vytvořte nová klíšťata','Създайте нови кърлежи','Erstellen Sie neue Zecken','Hozzon létre új kullancsokat','Жаңа кенелер жасаңыз'),(810,'interface','INTERFACE_ATTACHED_FILES','Прикрепленные файлы','Attached files','Archivos adjuntos','Přiložené soubory','Прикачени файлове','Angehängte Dokumente','Csatolt fájlok','Тіркелген файлдар'),(811,'interface','INTERFACE_CREATE_TICKET','Создать обращение','Create an appeal','Crear una apelación','Vytvořit odvolání','Създайте обжалване','Eine Berufung erstellen','Hozzon létre fellebbezést','Апелляция жасаңыз'),(812,'interface','INTERFACE_TRANSLATION','Переводы','Translations','Traducciones','Překlady','Преводи','Übersetzungen','Fordítások','Аударымдар'),(813,'interface','INTERFACE_MY_REACTIONS','Мои реакции',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(814,'interface','INTERFACE_PARTNER_STRUCTURE','Партнер/Стр-ра',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(815,'interface','INTERFACE_NUMBER_OF_LINES','Количество строк',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(816,'interface','INTERFACE_NO_TICKETS','У вас нет тикетов, чтобы создать обращение нажмите на кнопку',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(817,'interface','INTERFACE_NEXT','Следующая',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(818,'interface','INTERFACE_PREVIOUS','Предыдущая',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(819,'interface','INTERFACE_MUST_AUTH','Необходимо авторизоваться',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(820,'interface','INTERFACE_PARTNER_AUTH','Авторизоваться как партнер',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(821,'interface','INTERFACE_LIKE','Понравилось',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(822,'interface','INTERFACE_DISLIKE','Не понравилось',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(823,'interface','INTERFACE_ERROR_MAX_FILE_SIZE','Максимальный размер файла - 10 Мб',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(824,'interface','INTERFACE_ERROR_FILES_LIMIT','Вы можете загружать до 5 файлов',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(825,'interface','INTERFACE_SELECT_THEME','Выберите тип обращения',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(826,'interface','INTERFACE_DESCRIBE_SITUATION','Опишите ситуацию',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(827,'interface','INTERFACE_DESCRIBE_TITLE','Опишите тему вышей проблемы',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(828,'interface','INTERFACE_TICKET_TITLE','Тема обращения',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(829,'interface','INTERFACE_DELETE','Удалить',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(830,'interface','INTERFACE_MESSAGE_CREATION_TICKET','Ваше обращение создано',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(831,'interface','INTERFACE_MESSAGE_CREATION_TICKET_FULL','Ваше обращение в техподдержку VERTERA принято в обработку. В',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(832,'interface','INTERFACE_CLOSE','Закрыть',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(875,'interface','INTERFACE_AUTH_HEADER','Авторизация в системе VERTERA',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(876,'interface','INTERFACE_LOGIN','Логин',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(877,'interface','INTERFACE_PASSWORD','Пароль',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(878,'interface','INTERFACE_ERROR_AUTH','Неверный логин или пароль',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(879,'interface','INTERFACE_CANCEL','Отмена',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(880,'interface','INTERFACE_ENTER_NAME','Введите имя',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(881,'interface','INTERFACE_ENTER_SURNAME','Введите фамилию',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(882,'interface','INTERFACE_ENTER_PHONE','Введите номер телефона',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(883,'interface','INTERFACE_CHOOSE_DATE_OF_BIRTH','Выберите дату рождения',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(884,'interface','INTERFACE_CHOOSE_COUNTRY','Выберите страну',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(885,'interface','INTERFACE_ENTER_LOGIN','Укажите логин',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(886,'interface','INTERFACE_ENTER_PASSWORD','Укажите пароль',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(887,'interface','INTERFACE_BAD_PASSWORD','Плохой пароль',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(888,'interface','INTERFACE_SELECT_DEPARTMENT','Выберите департамент',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(889,'interface','INTERFACE_SELECT_JOB_TITLE','Выберите должность',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(890,'interface','INTERFACE_ERROR_ADD_CURATOR','Ошибка при добавлении куратора',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(891,'interface','INTERFACE_PATRONYMIC_PRESENCE','Отчество (при наличии)',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(892,'interface','INTERFACE_PHONE','Номер телефона',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(893,'interface','INTERFACE_MESSAGE_ADD_CURATOR','Куратор создан',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(894,'interface','INTERFACE_MESSAGE_ADD_CURATOR_FULL','Новый куратор успешно добавлен',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(903,'interface','INTERFACE_ENTER_SUBTHEME_TITLE','Укажите название подтемы',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(904,'interface','INTERFACE_ERROR_NEGATIVE_SORT','Порядок сортировки не может быть отрицательным',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(905,'interface','INTERFACE_ERROR_ADD_SUBTHEME','Ошибка при добавлении подтемы',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(906,'interface','INTERFACE_ADD_SUBTHEME','Добавить подтему',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(907,'interface','INTERFACE_SUBTHEME_TITLE','Название подтемы',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(908,'interface','INTERFACE_MESSAGE_SUBTHEME_CREATION','Подтема создана',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(909,'interface','INTERFACE_MESSAGE_SUBTHEME_CREATION_FULL','Новая подтема успешно создана',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(910,'country','COUNTRY_875JWBF57C74BDD3556858914C505ED5','Германия',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(911,'country','COUNTRY_G32BYQF57C74BDD3556858914C505ED5','Венгрия',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(912,'country','COUNTRY_PER65NF57C74BDD3556858914C505ED5','Казахстан',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(913,'ticketStatus','TICKETSTATUS_FEC7181AD224BDD6DFE9F161E960C936','Уведомление',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(915,'ticketStatus','TICKETSTATUS_B8C1135E8E7C840E57A0F98D3946C574','У наставника',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
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
  `visibility` smallint NOT NULL DEFAULT '3',
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
INSERT INTO `units` VALUES (1,'UNIT_38F4B792367665ECAB510E7236BEB3E4',1,1),(2,'UNIT_F91F5720E82A6C4D0257651298C590A9',2,1);
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
  `outerId` int unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `patronymic` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `countryId` int unsigned NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_UNIQUE` (`login`),
  UNIQUE KEY `outerId_UNIQUE` (`outerId`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,NULL,'VERTERA','Система',NULL,NULL,'system',1,'','admin','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(1,23,'Ярослав','Дубинов','Алексеевич',NULL,'client',1,'79573472132',NULL,NULL,1),(2,NULL,'Михаил','Гулевич','Константинович',NULL,'helper',2,'387654678645','misha','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(3,NULL,'Алексей','Пинчук','Иванович',NULL,'helper',3,'543345672132','lesha','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(4,24,'Константин','Кувалдович',NULL,NULL,'client',4,'456575675','kons','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(5,NULL,'Никита','Алексеев','Константинович',NULL,'helper',5,'98728749384','nikita','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(52,NULL,'Иван','Иванов','Иванович',NULL,'helper',1,'7999999988','ivan','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(53,NULL,'Дмитрий','Иванов','Иванович',NULL,'helper',1,'7999999988','dima','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(54,NULL,'Дмитрий','Курский','Иванович',NULL,'helper',1,'7999999988','kursk','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(55,NULL,'Матвей','Клинков','Сергеевич',NULL,'helper',1,'7999999988','matvei','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(57,NULL,'Праведнослав','Кувалдович','Святославович',NULL,'helper',1,'7993429188','pravednoslav','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(58,NULL,'Ирина','Павлова','Павловна',NULL,'helper',1,'7993429188','irina','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(59,NULL,'Татьяна','Пинчукова','Игоревна',NULL,'helper',1,'7993429188','tatyana','$2b$10$5JIiJqFiZQripQuWGr6Treg1XNXoyZhZjwG.9hXuZfkFzg1ZjUXrK',1),(60,NULL,'Данил','Заря','Артёмович',NULL,'helper',1,'7956439188','danil','$2b$10$KTVLAc8Mwf8f/UR4YBNQdu2xpoCGTJnSYU.4q2fVpbo9jnhkxqG.O',1),(61,25,'Ярослав','Дубинов','Алексеевич',NULL,'client',1,'79573472132',NULL,NULL,1),(62,479373,'Тестовый2','Пользователь2',NULL,NULL,'client',1,'+79058483300',NULL,NULL,1);
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

-- Dump completed on 2024-03-27 11:51:53
