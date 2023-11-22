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
INSERT INTO `attachments` VALUES (1,1,'/files/1/a9348906971dfbcf2835f44359476277.png'),(2,6,'/files/3/67acaccb9df2de102d68196b4a0eef9c.jpg'),(71,63,'test/a'),(72,63,'test/321');
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
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `individual` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Логистика ',0),(2,'Оперативная поддержка',0),(3,'Поддержка ЦО',0),(4,'WRT специалист',0),(5,'Вершинин',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
-- Table structure for table `helpers`
--

DROP TABLE IF EXISTS `helpers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helpers` (
  `id` int NOT NULL,
  `jobTitle` varchar(255) NOT NULL,
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
INSERT INTO `helpers` VALUES (0,'admin','2023-09-17','2023-09-17'),(2,'Куратор','2023-11-06','2001-12-23'),(3,'Руководитель','2023-10-01','2003-09-01'),(5,'Куратор','2023-09-17','2023-01-23');
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
INSERT INTO `messages` VALUES (1,1,2,1,'common',1,'lorem','2021-10-20 23:00:00'),(2,2,1,1,'common',1,'ipsum','2021-10-20 23:05:00'),(3,4,3,2,'common',1,'ogre','2023-11-20 23:02:00'),(4,3,4,2,'common',1,'mage','2023-11-20 23:06:00'),(5,4,3,2,'common',0,'best','2023-11-20 23:09:00'),(6,1,3,3,'common',0,'best','2023-11-20 23:19:00'),(7,0,1,1,'reacton',1,'Оцените ответ','2021-10-20 23:07:00'),(8,0,4,2,'system',1,'Вашим вопросом занимается Алексей','2023-11-20 23:19:00'),(60,0,1,14,'system',0,'Вашим вопросом занимается nikita','2023-11-20 20:08:26'),(61,0,1,14,'system',0,'Вашим вопросом занимается misha','2023-11-20 20:14:19'),(62,0,1,14,'system',0,'Вашим вопросом занимается misha','2023-11-20 20:27:08'),(63,1,3,15,'common',0,'test','2023-11-20 20:30:56'),(64,0,1,15,'system',0,'Вашим вопросом занимается lesha','2023-11-20 20:30:56');
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
  `name` varchar(45) NOT NULL DEFAULT 'none',
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
INSERT INTO `subthemes` VALUES (1,'Создание кошелька',1),(2,'Заявка на вывод токенов ',1),(3,'Пополнение личного кабинета',1),(4,'Оплата заказа токенами',1),(5,'Не пришли токены по акции',1),(6,'Прочие вопросы',1),(7,'Пожелания и предложения',1),(8,'Заявка на вывод средств',2),(9,'Приобретение invest пакета',2),(10,'Прочие вопросы',2),(11,'Пожелания и предложения',2),(12,'Изменение данных профиля',3),(13,'Проблемы с доступом',3),(14,'Удаление личных данных',3),(15,'Переоформление/передача ID номера',3),(16,'Подтверждение контактных данных',3),(17,'Изменение доверенного ЦО',3),(18,'Подтверждение Партнерского соглашения',3),(19,'Прочие вопросы',3),(20,'Пожелания и предложения',3),(21,'Выплата бонусов',4),(22,'Начисление бонусов',4),(23,'Пожелания и предложения',4),(24,'Прочие вопросы',4),(25,'Информация О Продукте',5),(26,'Наличие Продукции',5),(27,'Контроль качества',5),(28,'Прочие вопросы',5),(29,'Пожелания и предложения',5),(30,'Не верно указан адрес',6),(31,'Изменить получателя',6),(32,'Заказ не получен',6),(33,'Заказ пришел не в том объёме',6),(34,'Товар пришёл поврежденным',6),(35,'Прочие вопросы',6),(36,'Пожелания и предложения',6),(37,'Не выбрал подарочный продукт',7),(38,'Отмена заказа',7),(39,'Списать бонусы в счёт оплаты заказа',7),(40,'Не проходит оплата',7),(41,'Не верно указал адрес',7),(42,'Изменить получателя',7),(43,'Прочие вопросы',7),(44,'Пожелания и предложения',7),(45,'Консультация по условиям Акции',8),(46,'Не получил подарок по Акции',8),(47,'Не пришли токены по акции',8),(48,'Путешествия',8),(49,'Прочие вопросы',8),(50,'Пожелания и предложения',8),(51,'Вопрос по квалификации',9),(52,'WR Club 200+',9),(53,'Прочие вопросы',9),(54,'Пожелания и предложения',9),(55,'Коррекция по бинару',10),(56,'Коррекция Наставника',10),(57,'Коррекция бинарного статуса',10),(58,'Прочие вопросы',10),(59,'Пожелания и предложения',10),(60,'Уточнение деталей',11),(61,'Уведомление о системной ошибке',11),(62,'Прочие вопросы',11),(63,'Пожелания и предложения',11),(64,'Вопросы по сайту',12),(65,'Открытие Центра Обслуживания',12),(66,'Международные Рынки',12),(67,'Этический кодекс',12),(68,'Пожелания и предложения',12),(69,'Прочие вопросы',12),(70,'Поиск Информации',13),(71,'Пожелания и предложения',13),(72,'Прочие вопросы',13),(73,'none',14),(74,'none',15),(75,'none',16),(76,'Открыть продукты на ЦО',17),(77,'Закрыть продукты на ЦО',17),(78,'Контроль качества',17),(79,'Информация О Продукте',17),(80,'Прочие вопросы',17),(81,'Пожелания и предложения',17),(82,'Выставление счёта',18),(83,'Акты',18),(84,'Выплата дохода',18),(85,'Начисление дохода',18),(86,'Пожелания и предложения',18),(87,'Прочие вопросы',18),(88,'Наличие продукции',19),(89,'Пересорт',19),(90,'Прочие вопросы',19),(91,'Пожелания и предложения',19),(92,'Изменение состава заказа',20),(93,'Списание',20),(94,'Прочие вопросы',20),(95,'Акт сверки',20),(96,'Инвентаризация',20),(97,'Договор',21),(98,'Контакты',21),(99,'Товарные лимиты',21),(100,'Прочие вопросы',21),(101,'Пожелания и предложения',21),(102,'none',22),(103,'none',23);
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
  `name` varchar(45) NOT NULL,
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
INSERT INTO `themes` VALUES (1,'WRT Токены',1),(2,'Платформа D-INVEST',1),(3,'Личные данные',1),(4,'Бонусные вознаграждения',1),(5,'Вопросы по продукции',1),(6,'Доставка заказа (отправленный)',1),(7,'Изменение заказа (не отправленный)',1),(8,'Акции',1),(9,'Признания достижений',1),(10,'Ошибка в структуре',1),(11,'Маркетинг план',1),(12,'Вопросы по ведению бизнеса',1),(13,'Общие вопросы о компании',1),(14,'Прочие вопросы и предложения',1),(15,'Открытие Центра Обслуживания',2),(16,'Оформление офиса',2),(17,'Продукты',2),(18,'Финансы',2),(19,'Поставка',2),(20,'Корректировка остатков',2),(21,'Изменение данных',2),(22,'Закрытие офиса',2),(23,'Прочие вопросы и предложения',2);
/*!40000 ALTER TABLE `themes` ENABLE KEYS */;
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
  `reaction` varchar(255) DEFAULT NULL,
  `status` varchar(225) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,2,'2021-10-20 00:00:00',1,1,2,'like','Закрыт'),(2,4,3,'2023-11-20 00:00:00',1,14,73,'dislike','Закрыт'),(3,1,3,'2023-11-20 00:00:00',2,20,92,NULL,'Новый'),(11,1,2,'2023-11-19 01:17:49',1,6,31,NULL,'Новый'),(12,1,3,'2023-11-19 01:18:19',1,6,31,NULL,'Новый'),(13,1,2,'2023-11-19 01:18:25',1,6,31,NULL,'Новый'),(14,1,2,'2023-11-19 02:19:35',1,6,31,NULL,'Новый'),(15,1,3,'2023-11-20 20:30:56',1,6,31,NULL,'Новый');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `translations`
--

DROP TABLE IF EXISTS `translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `translations` (
  `id` int NOT NULL,
  `word` varchar(45) DEFAULT NULL,
  `russian` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translations`
--

LOCK TABLES `translations` WRITE;
/*!40000 ALTER TABLE `translations` DISABLE KEYS */;
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
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'Партнерам/Клиентам'),(2,'Держателям офиса');
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
  `country` varchar(255) NOT NULL,
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
INSERT INTO `users` VALUES (0,'system','system','none','','admin','complexPass',NULL),(1,'sanya','client','russia','797866786',NULL,NULL,NULL),(2,'misha','helper','africa','387654678645','misha','beats',NULL),(3,'lesha','helper','poland','543345672132','lesha','beats',NULL),(4,'kostya','client','china','456575675',NULL,NULL,NULL),(5,'nikita','helper','japan','98728749384','nikita','crown',NULL),(46,'test testich','client','russia','79999999','test','$2b$10$GgnULXdvdLkH1c3qFTIGCePrwBbovZ2fCNR1/74yzDfwRzHpsV0sG','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImlhdCI6MTcwMDY0Njk4MywiZXhwIjoxNzAwNjc1NzgzfQ.hxURuBI5xPUhL1zjJgaPihIVVsgQ4PscPvBa6q-bKDE');
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

-- Dump completed on 2023-11-22 18:28:33
