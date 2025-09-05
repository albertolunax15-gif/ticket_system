CREATE DATABASE IF NOT EXISTS `ticket_system`;
USE `ticket_system`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `users` (`id`, `username`, `password`, `name`, `lastname`, `created_at`, `updated_at`) VALUES
	(1, 'admin', '$2b$10$4KQRC5..sM9pZIgBG.A2au6PjkZ7eoXtRpfqP4TeCP.q088kSnzbm', 'Eddy', 'Ramos', '2025-09-05 22:51:26', '2025-09-05 22:51:26');

CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status` enum('Abierto','En Proceso','Cerrado','Resuelto') COLLATE utf8_unicode_ci DEFAULT 'Abierto',
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `priority` enum('Baja','Media','Alta','Crítica') COLLATE utf8_unicode_ci DEFAULT 'Media',
  `description` text COLLATE utf8_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tickets_status` (`status`),
  KEY `idx_tickets_priority` (`priority`),
  KEY `idx_tickets_category` (`category`),
  KEY `idx_tickets_user_id` (`user_id`),
  KEY `idx_tickets_created_at` (`created_at`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;