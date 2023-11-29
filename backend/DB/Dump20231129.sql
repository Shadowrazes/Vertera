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
  `id` int NOT NULL AUTO_INCREMENT,
  `messageId` int NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `AttachToMsgFK_idx` (`messageId`),
  CONSTRAINT `AttachToMsgFK` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (1,1,'/files/1/a9348906971dfbcf2835f44359476277.png'),(2,6,'/files/3/67acaccb9df2de102d68196b4a0eef9c.jpg');
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `ClientToUserFK` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'sanya@beats.ru'),(4,'kostya@beats.ru'),(46,'test@mail.ru');
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'COUNTRY_ROSSIYA'),(2,'COUNTRY_AFRIKA'),(3,'COUNTRY_POLSHA'),(4,'COUNTRY_KITAI'),(5,'COUNTRY_YAPONIYA');
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
  UNIQUE KEY `name_UNIQUE` (`nameCode`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'DEPARTMENT_LOGISTIKA',0),(2,'DEPARTMENT_OPERATIVNAYA_PODDERZHKA',0),(3,'DEPARTMENT_PODDERZHKA_TSO',0),(4,'DEPARTMENT_WRT_SPETSIALIST',0),(5,'DEPARTMENT_VERSHININ',1);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `helper_departments`
--

DROP TABLE IF EXISTS `helper_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helper_departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `helperId` int NOT NULL,
  `departmentId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `DepartmentToHelperFK_idx` (`helperId`),
  KEY `HelperToDepartmentFK_idx` (`departmentId`),
  CONSTRAINT `DepartmentToHelperFK` FOREIGN KEY (`helperId`) REFERENCES `helpers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `HelperToDepartmentFK` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helper_departments`
--

LOCK TABLES `helper_departments` WRITE;
/*!40000 ALTER TABLE `helper_departments` DISABLE KEYS */;
INSERT INTO `helper_departments` VALUES (1,2,3),(2,3,1),(3,3,2),(4,3,3),(5,5,5),(6,5,4);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helper_job_titles`
--

LOCK TABLES `helper_job_titles` WRITE;
/*!40000 ALTER TABLE `helper_job_titles` DISABLE KEYS */;
INSERT INTO `helper_job_titles` VALUES (1,'JOBTITLE_ADMINISTRATOR'),(2,'JOBTITLE_KURATOR'),(3,'JOBTITLE_RUKOVODITEL');
/*!40000 ALTER TABLE `helper_job_titles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `helpers`
--

DROP TABLE IF EXISTS `helpers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helpers` (
  `id` int NOT NULL,
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
INSERT INTO `helpers` VALUES (0,1,'2023-09-17','2023-09-17'),(2,2,'2023-11-06','2001-12-23'),(3,3,'2023-10-01','2003-09-01'),(5,2,'2023-09-17','2023-01-23');
/*!40000 ALTER TABLE `helpers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` int NOT NULL,
  `recieverId` int NOT NULL,
  `ticketId` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `readed` tinyint(1) NOT NULL,
  `text` text NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `MsgToTicketFK_idx` (`ticketId`),
  CONSTRAINT `MsgToTicketFK` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,2,1,'message',1,'lorem','2021-10-20 23:00:00'),(2,2,1,1,'message',1,'ipsum','2021-10-20 23:05:00'),(3,4,3,2,'message',1,'ogre','2023-11-20 23:02:00'),(4,3,4,2,'message',1,'mage','2023-11-20 23:06:00'),(5,4,3,2,'message',0,'best','2023-11-20 23:09:00'),(6,1,3,3,'message',0,'best','2023-11-20 23:19:00'),(7,0,1,1,'reacton',1,'Оцените ответ','2021-10-20 23:07:00'),(8,0,4,2,'helperChange',1,'Вашим вопросом занимается Алексей','2023-11-20 23:19:00');
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
  PRIMARY KEY (`id`),
  KEY `SubThemeToThemeFK_idx` (`themeId`),
  CONSTRAINT `SubThemeToThemeFK` FOREIGN KEY (`themeId`) REFERENCES `subthemes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subthemes`
--

LOCK TABLES `subthemes` WRITE;
/*!40000 ALTER TABLE `subthemes` DISABLE KEYS */;
INSERT INTO `subthemes` VALUES (1,'SUBTHEME_1_SOZDANIE_KOSHELKA',1),(2,'SUBTHEME_2_ZAYAVKA_NA_VIVOD_TOKENOV_',1),(3,'SUBTHEME_3_POPOLNENIE_LICHNOGO_KABINETA',1),(4,'SUBTHEME_4_OPLATA_ZAKAZA_TOKENAMI',1),(5,'SUBTHEME_5_NE_PRISHLI_TOKENI_PO_AKTSII',1),(6,'SUBTHEME_6_PROCHIE_VOPROSI',1),(7,'SUBTHEME_7_POZHELANIYA_I_PREDLOZHENIYA',1),(8,'SUBTHEME_8_ZAYAVKA_NA_VIVOD_SREDSTV',2),(9,'SUBTHEME_9_PRIOBRETENIE_INVEST_PAKETA',2),(10,'SUBTHEME_10_PROCHIE_VOPROSI',2),(11,'SUBTHEME_11_POZHELANIYA_I_PREDLOZHENIYA',2),(12,'SUBTHEME_12_IZMENENIE_DANNIKH_PROFILYA',3),(13,'SUBTHEME_13_PROBLEMI_S_DOSTUPOM',3),(14,'SUBTHEME_14_UDALENIE_LICHNIKH_DANNIKH',3),(15,'SUBTHEME_15_PEREOFORMLENIE/PEREDACHA_ID_NOMERA',3),(16,'SUBTHEME_16_PODTVERZHDENIE_KONTAKTNIKH_DANNIKH',3),(17,'SUBTHEME_17_IZMENENIE_DOVERENNOGO_TSO',3),(18,'SUBTHEME_18_PODTVERZHDENIE_PARTNERSKOGO_SOGLASHENIYA',3),(19,'SUBTHEME_19_PROCHIE_VOPROSI',3),(20,'SUBTHEME_20_POZHELANIYA_I_PREDLOZHENIYA',3),(21,'SUBTHEME_21_VIPLATA_BONUSOV',4),(22,'SUBTHEME_22_NACHISLENIE_BONUSOV',4),(23,'SUBTHEME_23_POZHELANIYA_I_PREDLOZHENIYA',4),(24,'SUBTHEME_24_PROCHIE_VOPROSI',4),(25,'SUBTHEME_25_INFORMATSIYA_O_PRODUKTE',5),(26,'SUBTHEME_26_NALICHIE_PRODUKTSII',5),(27,'SUBTHEME_27_KONTROL_KACHESTVA',5),(28,'SUBTHEME_28_PROCHIE_VOPROSI',5),(29,'SUBTHEME_29_POZHELANIYA_I_PREDLOZHENIYA',5),(30,'SUBTHEME_30_NE_VERNO_UKAZAN_ADRES',6),(31,'SUBTHEME_31_IZMENIT_POLUCHATELYA',6),(32,'SUBTHEME_32_ZAKAZ_NE_POLUCHEN',6),(33,'SUBTHEME_33_ZAKAZ_PRISHEL_NE_V_TOM_OBYOME',6),(34,'SUBTHEME_34_TOVAR_PRISHYOL_POVREZHDENNIM',6),(35,'SUBTHEME_35_PROCHIE_VOPROSI',6),(36,'SUBTHEME_36_POZHELANIYA_I_PREDLOZHENIYA',6),(37,'SUBTHEME_37_NE_VIBRAL_PODAROCHNII_PRODUKT',7),(38,'SUBTHEME_38_OTMENA_ZAKAZA',7),(39,'SUBTHEME_39_SPISAT_BONUSI_V_SCHYOT_OPLATI_ZAKAZA',7),(40,'SUBTHEME_40_NE_PROKHODIT_OPLATA',7),(41,'SUBTHEME_41_NE_VERNO_UKAZAL_ADRES',7),(42,'SUBTHEME_42_IZMENIT_POLUCHATELYA',7),(43,'SUBTHEME_43_PROCHIE_VOPROSI',7),(44,'SUBTHEME_44_POZHELANIYA_I_PREDLOZHENIYA',7),(45,'SUBTHEME_45_KONSULTATSIYA_PO_USLOVIYAM_AKTSII',8),(46,'SUBTHEME_46_NE_POLUCHIL_PODAROK_PO_AKTSII',8),(47,'SUBTHEME_47_NE_PRISHLI_TOKENI_PO_AKTSII',8),(48,'SUBTHEME_48_PUTESHESTVIYA',8),(49,'SUBTHEME_49_PROCHIE_VOPROSI',8),(50,'SUBTHEME_50_POZHELANIYA_I_PREDLOZHENIYA',8),(51,'SUBTHEME_51_VOPROS_PO_KVALIFIKATSII',9),(52,'SUBTHEME_52_WR_CLUB_200+',9),(53,'SUBTHEME_53_PROCHIE_VOPROSI',9),(54,'SUBTHEME_54_POZHELANIYA_I_PREDLOZHENIYA',9),(55,'SUBTHEME_55_KORREKTSIYA_PO_BINARU',10),(56,'SUBTHEME_56_KORREKTSIYA_NASTAVNIKA',10),(57,'SUBTHEME_57_KORREKTSIYA_BINARNOGO_STATUSA',10),(58,'SUBTHEME_58_PROCHIE_VOPROSI',10),(59,'SUBTHEME_59_POZHELANIYA_I_PREDLOZHENIYA',10),(60,'SUBTHEME_60_UTOCHNENIE_DETALEI',11),(61,'SUBTHEME_61_UVEDOMLENIE_O_SISTEMNOI_OSHIBKE',11),(62,'SUBTHEME_62_PROCHIE_VOPROSI',11),(63,'SUBTHEME_63_POZHELANIYA_I_PREDLOZHENIYA',11),(64,'SUBTHEME_64_VOPROSI_PO_SAITU',12),(65,'SUBTHEME_65_OTKRITIE_TSENTRA_OBSLUZHIVANIYA',12),(66,'SUBTHEME_66_MEZHDUNARODNIE_RINKI',12),(67,'SUBTHEME_67_ETICHESKII_KODEKS',12),(68,'SUBTHEME_68_POZHELANIYA_I_PREDLOZHENIYA',12),(69,'SUBTHEME_69_PROCHIE_VOPROSI',12),(70,'SUBTHEME_70_POISK_INFORMATSII',13),(71,'SUBTHEME_71_POZHELANIYA_I_PREDLOZHENIYA',13),(72,'SUBTHEME_72_PROCHIE_VOPROSI',13),(73,'SUBTHEME_73_NONE',14),(74,'SUBTHEME_74_NONE',15),(75,'SUBTHEME_75_NONE',16),(76,'SUBTHEME_76_OTKRIT_PRODUKTI_NA_TSO',17),(77,'SUBTHEME_77_ZAKRIT_PRODUKTI_NA_TSO',17),(78,'SUBTHEME_78_KONTROL_KACHESTVA',17),(79,'SUBTHEME_79_INFORMATSIYA_O_PRODUKTE',17),(80,'SUBTHEME_80_PROCHIE_VOPROSI',17),(81,'SUBTHEME_81_POZHELANIYA_I_PREDLOZHENIYA',17),(82,'SUBTHEME_82_VISTAVLENIE_SCHYOTA',18),(83,'SUBTHEME_83_AKTI',18),(84,'SUBTHEME_84_VIPLATA_DOKHODA',18),(85,'SUBTHEME_85_NACHISLENIE_DOKHODA',18),(86,'SUBTHEME_86_POZHELANIYA_I_PREDLOZHENIYA',18),(87,'SUBTHEME_87_PROCHIE_VOPROSI',18),(88,'SUBTHEME_88_NALICHIE_PRODUKTSII',19),(89,'SUBTHEME_89_PERESORT',19),(90,'SUBTHEME_90_PROCHIE_VOPROSI',19),(91,'SUBTHEME_91_POZHELANIYA_I_PREDLOZHENIYA',19),(92,'SUBTHEME_92_IZMENENIE_SOSTAVA_ZAKAZA',20),(93,'SUBTHEME_93_SPISANIE',20),(94,'SUBTHEME_94_PROCHIE_VOPROSI',20),(95,'SUBTHEME_95_AKT_SVERKI',20),(96,'SUBTHEME_96_INVENTARIZATSIYA',20),(97,'SUBTHEME_97_DOGOVOR',21),(98,'SUBTHEME_98_KONTAKTI',21),(99,'SUBTHEME_99_TOVARNIE_LIMITI',21),(100,'SUBTHEME_100_PROCHIE_VOPROSI',21),(101,'SUBTHEME_101_POZHELANIYA_I_PREDLOZHENIYA',21),(102,'SUBTHEME_102_NONE',22),(103,'SUBTHEME_103_NONE',23);
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
INSERT INTO `theme_departments` VALUES (1,1,4),(2,2,4),(3,3,4),(4,4,4),(5,5,2),(6,6,4),(7,7,4),(8,8,4),(9,9,4),(10,10,4),(11,11,4),(12,12,2),(13,13,2),(14,14,2),(15,15,2),(16,16,2),(17,17,2),(18,18,2),(19,19,2),(20,20,2),(21,21,2),(22,22,2),(23,23,2),(24,24,2),(25,25,2),(26,26,3),(27,27,2),(28,28,2),(29,29,2),(30,30,1),(31,30,2),(32,30,3),(33,31,1),(34,31,2),(35,31,3),(36,32,1),(37,32,2),(38,32,3),(39,33,1),(40,33,2),(41,33,3),(42,34,1),(43,34,2),(44,34,3),(45,35,1),(46,35,2),(47,35,3),(48,36,1),(49,36,2),(50,36,3),(51,37,2),(52,38,2),(53,39,2),(54,40,2),(55,41,1),(56,41,2),(57,41,3),(58,42,1),(59,42,2),(60,42,3),(61,43,2),(62,44,2),(63,45,2),(64,46,2),(65,47,2),(66,48,2),(67,49,2),(68,50,2),(69,51,2),(70,52,2),(71,53,2),(72,54,2),(73,55,2),(74,56,2),(75,57,2),(76,58,2),(77,59,2),(78,60,2),(79,61,2),(80,62,2),(81,63,2),(82,64,2),(83,65,3),(84,66,5),(85,67,2),(86,68,2),(87,69,2),(88,70,2),(89,71,2),(90,72,2),(91,73,2),(92,74,3),(93,75,3),(94,76,3),(95,77,3),(96,78,3),(97,79,2),(98,80,2),(99,81,2),(100,82,3),(101,83,3),(102,84,3),(103,85,3),(104,86,3),(105,87,3),(106,88,1),(107,89,1),(108,90,1),(109,91,1),(110,92,3),(111,92,2),(112,93,3),(113,94,3),(114,95,3),(115,96,3),(116,97,3),(117,98,3),(118,99,3),(119,100,3),(120,101,3),(121,102,3),(122,103,3);
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
  PRIMARY KEY (`id`),
  KEY `ThemeToUnitFK_idx` (`unitId`),
  CONSTRAINT `ThemeToUnitFK` FOREIGN KEY (`unitId`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `themes`
--

LOCK TABLES `themes` WRITE;
/*!40000 ALTER TABLE `themes` DISABLE KEYS */;
INSERT INTO `themes` VALUES (1,'THEME_1_WRT_TOKENI',1),(2,'THEME_2_PLATFORMA_D-INVEST',1),(3,'THEME_3_LICHNIE_DANNIE',1),(4,'THEME_4_BONUSNIE_VOZNAGRAZHDENIYA',1),(5,'THEME_5_VOPROSI_PO_PRODUKTSII',1),(6,'THEME_6_DOSTAVKA_ZAKAZA_(OTPRAVLENNII)',1),(7,'THEME_7_IZMENENIE_ZAKAZA_(NE_OTPRAVLENNII)',1),(8,'THEME_8_AKTSII',1),(9,'THEME_9_PRIZNANIYA_DOSTIZHENII',1),(10,'THEME_10_OSHIBKA_V_STRUKTURE',1),(11,'THEME_11_MARKETING_PLAN',1),(12,'THEME_12_VOPROSI_PO_VEDENIYU_BIZNESA',1),(13,'THEME_13_OBSHCHIE_VOPROSI_O_KOMPANII',1),(14,'THEME_14_PROCHIE_VOPROSI_I_PREDLOZHENIYA',1),(15,'THEME_15_OTKRITIE_TSENTRA_OBSLUZHIVANIYA',2),(16,'THEME_16_OFORMLENIE_OFISA',2),(17,'THEME_17_PRODUKTI',2),(18,'THEME_18_FINANSI',2),(19,'THEME_19_POSTAVKA',2),(20,'THEME_20_KORREKTIROVKA_OSTATKOV',2),(21,'THEME_21_IZMENENIE_DANNIKH',2),(22,'THEME_22_ZAKRITIE_OFISA',2),(23,'THEME_23_PROCHIE_VOPROSI_I_PREDLOZHENIYA',2);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_statuses`
--

LOCK TABLES `ticket_statuses` WRITE;
/*!40000 ALTER TABLE `ticket_statuses` DISABLE KEYS */;
INSERT INTO `ticket_statuses` VALUES (1,'TICKETSTATUS_NOVII'),(2,'TICKETSTATUS_ZAKRIT'),(3,'TICKETSTATUS_V_OZHIDANII');
/*!40000 ALTER TABLE `ticket_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientId` int NOT NULL,
  `helperId` int NOT NULL,
  `date` datetime NOT NULL,
  `unitId` int NOT NULL,
  `themeId` int NOT NULL,
  `subThemeId` int NOT NULL,
  `statusId` int NOT NULL,
  `reaction` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,2,'2021-10-20 00:00:00',1,1,2,2,'like'),(2,4,3,'2023-11-20 00:00:00',1,14,73,2,'dislike'),(3,1,3,'2023-11-20 00:00:00',2,20,92,1,NULL),(11,1,2,'2023-11-19 01:17:49',1,6,31,1,NULL),(12,1,3,'2023-11-19 01:18:19',1,6,31,1,NULL),(13,1,2,'2023-11-19 01:18:25',1,6,31,1,NULL),(14,1,2,'2023-11-19 02:19:35',1,6,31,1,NULL),(15,1,3,'2023-11-20 20:30:56',1,6,31,1,NULL);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=715 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translations`
--

LOCK TABLES `translations` WRITE;
/*!40000 ALTER TABLE `translations` DISABLE KEYS */;
INSERT INTO `translations` VALUES (556,'ticketStatus','TICKETSTATUS_NOVII','Новый',NULL),(557,'ticketStatus','TICKETSTATUS_ZAKRIT','Закрыт',NULL),(558,'ticketStatus','TICKETSTATUS_V_OZHIDANII','В ожидании',NULL),(559,'subTheme','SUBTHEME_1_SOZDANIE_KOSHELKA','Создание кошелька',NULL),(560,'subTheme','SUBTHEME_2_ZAYAVKA_NA_VIVOD_TOKENOV_','Заявка на вывод токенов ',NULL),(561,'subTheme','SUBTHEME_3_POPOLNENIE_LICHNOGO_KABINETA','Пополнение личного кабинета',NULL),(562,'subTheme','SUBTHEME_4_OPLATA_ZAKAZA_TOKENAMI','Оплата заказа токенами',NULL),(563,'subTheme','SUBTHEME_5_NE_PRISHLI_TOKENI_PO_AKTSII','Не пришли токены по акции',NULL),(564,'subTheme','SUBTHEME_6_PROCHIE_VOPROSI','Прочие вопросы',NULL),(565,'subTheme','SUBTHEME_7_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(566,'subTheme','SUBTHEME_8_ZAYAVKA_NA_VIVOD_SREDSTV','Заявка на вывод средств',NULL),(567,'subTheme','SUBTHEME_9_PRIOBRETENIE_INVEST_PAKETA','Приобретение invest пакета',NULL),(568,'subTheme','SUBTHEME_10_PROCHIE_VOPROSI','Прочие вопросы',NULL),(569,'subTheme','SUBTHEME_11_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(570,'subTheme','SUBTHEME_12_IZMENENIE_DANNIKH_PROFILYA','Изменение данных профиля',NULL),(571,'subTheme','SUBTHEME_13_PROBLEMI_S_DOSTUPOM','Проблемы с доступом',NULL),(572,'subTheme','SUBTHEME_14_UDALENIE_LICHNIKH_DANNIKH','Удаление личных данных',NULL),(573,'subTheme','SUBTHEME_15_PEREOFORMLENIE/PEREDACHA_ID_NOMERA','Переоформление/передача ID номера',NULL),(574,'subTheme','SUBTHEME_16_PODTVERZHDENIE_KONTAKTNIKH_DANNIKH','Подтверждение контактных данных',NULL),(575,'subTheme','SUBTHEME_17_IZMENENIE_DOVERENNOGO_TSO','Изменение доверенного ЦО',NULL),(576,'subTheme','SUBTHEME_18_PODTVERZHDENIE_PARTNERSKOGO_SOGLASHENIYA','Подтверждение Партнерского соглашения',NULL),(577,'subTheme','SUBTHEME_19_PROCHIE_VOPROSI','Прочие вопросы',NULL),(578,'subTheme','SUBTHEME_20_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(579,'subTheme','SUBTHEME_21_VIPLATA_BONUSOV','Выплата бонусов',NULL),(580,'subTheme','SUBTHEME_22_NACHISLENIE_BONUSOV','Начисление бонусов',NULL),(581,'subTheme','SUBTHEME_23_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(582,'subTheme','SUBTHEME_24_PROCHIE_VOPROSI','Прочие вопросы',NULL),(583,'subTheme','SUBTHEME_25_INFORMATSIYA_O_PRODUKTE','Информация О Продукте',NULL),(584,'subTheme','SUBTHEME_26_NALICHIE_PRODUKTSII','Наличие Продукции',NULL),(585,'subTheme','SUBTHEME_27_KONTROL_KACHESTVA','Контроль качества',NULL),(586,'subTheme','SUBTHEME_28_PROCHIE_VOPROSI','Прочие вопросы',NULL),(587,'subTheme','SUBTHEME_29_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(588,'subTheme','SUBTHEME_30_NE_VERNO_UKAZAN_ADRES','Не верно указан адрес',NULL),(589,'subTheme','SUBTHEME_31_IZMENIT_POLUCHATELYA','Изменить получателя',NULL),(590,'subTheme','SUBTHEME_32_ZAKAZ_NE_POLUCHEN','Заказ не получен',NULL),(591,'subTheme','SUBTHEME_33_ZAKAZ_PRISHEL_NE_V_TOM_OBYOME','Заказ пришел не в том объёме',NULL),(592,'subTheme','SUBTHEME_34_TOVAR_PRISHYOL_POVREZHDENNIM','Товар пришёл поврежденным',NULL),(593,'subTheme','SUBTHEME_35_PROCHIE_VOPROSI','Прочие вопросы',NULL),(594,'subTheme','SUBTHEME_36_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(595,'subTheme','SUBTHEME_37_NE_VIBRAL_PODAROCHNII_PRODUKT','Не выбрал подарочный продукт',NULL),(596,'subTheme','SUBTHEME_38_OTMENA_ZAKAZA','Отмена заказа',NULL),(597,'subTheme','SUBTHEME_39_SPISAT_BONUSI_V_SCHYOT_OPLATI_ZAKAZA','Списать бонусы в счёт оплаты заказа',NULL),(598,'subTheme','SUBTHEME_40_NE_PROKHODIT_OPLATA','Не проходит оплата',NULL),(599,'subTheme','SUBTHEME_41_NE_VERNO_UKAZAL_ADRES','Не верно указал адрес',NULL),(600,'subTheme','SUBTHEME_42_IZMENIT_POLUCHATELYA','Изменить получателя',NULL),(601,'subTheme','SUBTHEME_43_PROCHIE_VOPROSI','Прочие вопросы',NULL),(602,'subTheme','SUBTHEME_44_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(603,'subTheme','SUBTHEME_45_KONSULTATSIYA_PO_USLOVIYAM_AKTSII','Консультация по условиям Акции',NULL),(604,'subTheme','SUBTHEME_46_NE_POLUCHIL_PODAROK_PO_AKTSII','Не получил подарок по Акции',NULL),(605,'subTheme','SUBTHEME_47_NE_PRISHLI_TOKENI_PO_AKTSII','Не пришли токены по акции',NULL),(606,'subTheme','SUBTHEME_48_PUTESHESTVIYA','Путешествия',NULL),(607,'subTheme','SUBTHEME_49_PROCHIE_VOPROSI','Прочие вопросы',NULL),(608,'subTheme','SUBTHEME_50_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(609,'subTheme','SUBTHEME_51_VOPROS_PO_KVALIFIKATSII','Вопрос по квалификации',NULL),(610,'subTheme','SUBTHEME_52_WR_CLUB_200+','WR Club 200+',NULL),(611,'subTheme','SUBTHEME_53_PROCHIE_VOPROSI','Прочие вопросы',NULL),(612,'subTheme','SUBTHEME_54_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(613,'subTheme','SUBTHEME_55_KORREKTSIYA_PO_BINARU','Коррекция по бинару',NULL),(614,'subTheme','SUBTHEME_56_KORREKTSIYA_NASTAVNIKA','Коррекция Наставника',NULL),(615,'subTheme','SUBTHEME_57_KORREKTSIYA_BINARNOGO_STATUSA','Коррекция бинарного статуса',NULL),(616,'subTheme','SUBTHEME_58_PROCHIE_VOPROSI','Прочие вопросы',NULL),(617,'subTheme','SUBTHEME_59_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(618,'subTheme','SUBTHEME_60_UTOCHNENIE_DETALEI','Уточнение деталей',NULL),(619,'subTheme','SUBTHEME_61_UVEDOMLENIE_O_SISTEMNOI_OSHIBKE','Уведомление о системной ошибке',NULL),(620,'subTheme','SUBTHEME_62_PROCHIE_VOPROSI','Прочие вопросы',NULL),(621,'subTheme','SUBTHEME_63_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(622,'subTheme','SUBTHEME_64_VOPROSI_PO_SAITU','Вопросы по сайту',NULL),(623,'subTheme','SUBTHEME_65_OTKRITIE_TSENTRA_OBSLUZHIVANIYA','Открытие Центра Обслуживания',NULL),(624,'subTheme','SUBTHEME_66_MEZHDUNARODNIE_RINKI','Международные Рынки',NULL),(625,'subTheme','SUBTHEME_67_ETICHESKII_KODEKS','Этический кодекс',NULL),(626,'subTheme','SUBTHEME_68_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(627,'subTheme','SUBTHEME_69_PROCHIE_VOPROSI','Прочие вопросы',NULL),(628,'subTheme','SUBTHEME_70_POISK_INFORMATSII','Поиск Информации',NULL),(629,'subTheme','SUBTHEME_71_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(630,'subTheme','SUBTHEME_72_PROCHIE_VOPROSI','Прочие вопросы',NULL),(631,'subTheme','SUBTHEME_73_NONE','none',NULL),(632,'subTheme','SUBTHEME_74_NONE','none',NULL),(633,'subTheme','SUBTHEME_75_NONE','none',NULL),(634,'subTheme','SUBTHEME_76_OTKRIT_PRODUKTI_NA_TSO','Открыть продукты на ЦО',NULL),(635,'subTheme','SUBTHEME_77_ZAKRIT_PRODUKTI_NA_TSO','Закрыть продукты на ЦО',NULL),(636,'subTheme','SUBTHEME_78_KONTROL_KACHESTVA','Контроль качества',NULL),(637,'subTheme','SUBTHEME_79_INFORMATSIYA_O_PRODUKTE','Информация О Продукте',NULL),(638,'subTheme','SUBTHEME_80_PROCHIE_VOPROSI','Прочие вопросы',NULL),(639,'subTheme','SUBTHEME_81_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(640,'subTheme','SUBTHEME_82_VISTAVLENIE_SCHYOTA','Выставление счёта',NULL),(641,'subTheme','SUBTHEME_83_AKTI','Акты',NULL),(642,'subTheme','SUBTHEME_84_VIPLATA_DOKHODA','Выплата дохода',NULL),(643,'subTheme','SUBTHEME_85_NACHISLENIE_DOKHODA','Начисление дохода',NULL),(644,'subTheme','SUBTHEME_86_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(645,'subTheme','SUBTHEME_87_PROCHIE_VOPROSI','Прочие вопросы',NULL),(646,'subTheme','SUBTHEME_88_NALICHIE_PRODUKTSII','Наличие продукции',NULL),(647,'subTheme','SUBTHEME_89_PERESORT','Пересорт',NULL),(648,'subTheme','SUBTHEME_90_PROCHIE_VOPROSI','Прочие вопросы',NULL),(649,'subTheme','SUBTHEME_91_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(650,'subTheme','SUBTHEME_92_IZMENENIE_SOSTAVA_ZAKAZA','Изменение состава заказа',NULL),(651,'subTheme','SUBTHEME_93_SPISANIE','Списание',NULL),(652,'subTheme','SUBTHEME_94_PROCHIE_VOPROSI','Прочие вопросы',NULL),(653,'subTheme','SUBTHEME_95_AKT_SVERKI','Акт сверки',NULL),(654,'subTheme','SUBTHEME_96_INVENTARIZATSIYA','Инвентаризация',NULL),(655,'subTheme','SUBTHEME_97_DOGOVOR','Договор',NULL),(656,'subTheme','SUBTHEME_98_KONTAKTI','Контакты',NULL),(657,'subTheme','SUBTHEME_99_TOVARNIE_LIMITI','Товарные лимиты',NULL),(658,'subTheme','SUBTHEME_100_PROCHIE_VOPROSI','Прочие вопросы',NULL),(659,'subTheme','SUBTHEME_101_POZHELANIYA_I_PREDLOZHENIYA','Пожелания и предложения',NULL),(660,'subTheme','SUBTHEME_102_NONE','none',NULL),(661,'subTheme','SUBTHEME_103_NONE','none',NULL),(662,'theme','THEME_1_WRT_TOKENI','WRT Токены',NULL),(663,'theme','THEME_2_PLATFORMA_D-INVEST','Платформа D-INVEST',NULL),(664,'theme','THEME_3_LICHNIE_DANNIE','Личные данные',NULL),(665,'theme','THEME_4_BONUSNIE_VOZNAGRAZHDENIYA','Бонусные вознаграждения',NULL),(666,'theme','THEME_5_VOPROSI_PO_PRODUKTSII','Вопросы по продукции',NULL),(667,'theme','THEME_6_DOSTAVKA_ZAKAZA_(OTPRAVLENNII)','Доставка заказа (отправленный)',NULL),(668,'theme','THEME_7_IZMENENIE_ZAKAZA_(NE_OTPRAVLENNII)','Изменение заказа (не отправленный)',NULL),(669,'theme','THEME_8_AKTSII','Акции',NULL),(670,'theme','THEME_9_PRIZNANIYA_DOSTIZHENII','Признания достижений',NULL),(671,'theme','THEME_10_OSHIBKA_V_STRUKTURE','Ошибка в структуре',NULL),(672,'theme','THEME_11_MARKETING_PLAN','Маркетинг план',NULL),(673,'theme','THEME_12_VOPROSI_PO_VEDENIYU_BIZNESA','Вопросы по ведению бизнеса',NULL),(674,'theme','THEME_13_OBSHCHIE_VOPROSI_O_KOMPANII','Общие вопросы о компании',NULL),(675,'theme','THEME_14_PROCHIE_VOPROSI_I_PREDLOZHENIYA','Прочие вопросы и предложения',NULL),(676,'theme','THEME_15_OTKRITIE_TSENTRA_OBSLUZHIVANIYA','Открытие Центра Обслуживания',NULL),(677,'theme','THEME_16_OFORMLENIE_OFISA','Оформление офиса',NULL),(678,'theme','THEME_17_PRODUKTI','Продукты',NULL),(679,'theme','THEME_18_FINANSI','Финансы',NULL),(680,'theme','THEME_19_POSTAVKA','Поставка',NULL),(681,'theme','THEME_20_KORREKTIROVKA_OSTATKOV','Корректировка остатков',NULL),(682,'theme','THEME_21_IZMENENIE_DANNIKH','Изменение данных',NULL),(683,'theme','THEME_22_ZAKRITIE_OFISA','Закрытие офиса',NULL),(684,'theme','THEME_23_PROCHIE_VOPROSI_I_PREDLOZHENIYA','Прочие вопросы и предложения',NULL),(685,'unit','UNIT_1_PARTNERAM/KLIENTAM','Партнерам/Клиентам',NULL),(686,'unit','UNIT_2_DERZHATELYAM_OFISA','Держателям офиса',NULL),(697,'department','DEPARTMENT_LOGISTIKA','Логистика',NULL),(698,'department','DEPARTMENT_OPERATIVNAYA_PODDERZHKA','Оперативная поддержка',NULL),(699,'department','DEPARTMENT_PODDERZHKA_TSO','Поддержка ЦО',NULL),(700,'department','DEPARTMENT_WRT_SPETSIALIST','WRT специалист',NULL),(701,'department','DEPARTMENT_VERSHININ','Вершинин',NULL),(702,'jobTitle','JOBTITLE_ADMINISTRATOR','Администратор',NULL),(703,'jobTitle','JOBTITLE_KURATOR','Куратор',NULL),(704,'jobTitle','JOBTITLE_RUKOVODITEL','Руководитель',NULL),(709,'country','COUNTRY_ROSSIYA','Россия',NULL),(710,'country','COUNTRY_AFRIKA','Африка',NULL),(711,'country','COUNTRY_POLSHA','Польша',NULL),(712,'country','COUNTRY_KITAI','Китай',NULL),(713,'country','COUNTRY_YAPONIYA','Япония',NULL);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'UNIT_1_PARTNERAM/KLIENTAM'),(2,'UNIT_2_DERZHATELYAM_OFISA');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `countryId` int NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `token` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_UNIQUE` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'system','system',1,'','admin','complexPass',NULL),(1,'sanya','client',1,'797866786',NULL,NULL,NULL),(2,'misha','helper',2,'387654678645','misha','beats',NULL),(3,'lesha','helper',3,'543345672132','lesha','beats',NULL),(4,'kostya','client',4,'456575675',NULL,NULL,NULL),(5,'nikita','helper',5,'98728749384','nikita','crown',NULL),(46,'test testich','client',1,'79999999','test','$2b$10$GgnULXdvdLkH1c3qFTIGCePrwBbovZ2fCNR1/74yzDfwRzHpsV0sG','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImlhdCI6MTcwMDY0Njk4MywiZXhwIjoxNzAwNjc1NzgzfQ.hxURuBI5xPUhL1zjJgaPihIVVsgQ4PscPvBa6q-bKDE');
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

-- Dump completed on 2023-11-29 23:32:06
