CREATE TABLE `assistance_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ref` text NOT NULL,
	`user_id` integer NOT NULL,
	`vehicle_id` integer NOT NULL,
	`service` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`notes` text,
	`status` text NOT NULL,
	`provider_id` integer,
	`price_quoted_rm` real,
	`price_final_rm` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assistance_requests_ref_unique` ON `assistance_requests` (`ref`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_type` text NOT NULL,
	`actor_id` integer,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`before_json` text,
	`after_json` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `claim_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`claim_id` integer NOT NULL,
	`type` text NOT NULL,
	`payload` text,
	`actor_type` text NOT NULL,
	`actor_id` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `claims` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ref` text NOT NULL,
	`user_id` integer NOT NULL,
	`vehicle_id` integer NOT NULL,
	`incident_at` integer NOT NULL,
	`location_lat` real NOT NULL,
	`location_lng` real NOT NULL,
	`location_text` text,
	`police_report_no` text,
	`insurer_name` text,
	`insurer_ref` text,
	`status` text NOT NULL,
	`severity` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `claims_ref_unique` ON `claims` (`ref`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`claim_id` integer NOT NULL,
	`kind` text NOT NULL,
	`url` text NOT NULL,
	`mime` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`checksum` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `provider_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` integer NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`role` text NOT NULL,
	FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_users_email_unique` ON `provider_users` (`email`);--> statement-breakpoint
CREATE TABLE `providers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`service_area_geojson` text,
	`rating` real,
	`active` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`roles` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`plate` text NOT NULL,
	`make` text,
	`model` text,
	`year` integer,
	`insurer_name` text,
	`policy_no` text,
	`policy_valid_from` integer,
	`policy_valid_to` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workshop_estimates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`claim_id` integer NOT NULL,
	`provider_id` integer NOT NULL,
	`parts_json` text NOT NULL,
	`labor_hours` real NOT NULL,
	`total_rm` real NOT NULL,
	`eta_days` integer,
	`files_json` text,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON UPDATE no action ON DELETE no action
);
