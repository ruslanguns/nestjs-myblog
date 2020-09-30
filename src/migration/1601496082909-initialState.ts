import {MigrationInterface, QueryRunner} from "typeorm";

export class initialState1601496082909 implements MigrationInterface {
    name = 'initialState1601496082909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `last_name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(128) NOT NULL, `roles` text NOT NULL, `status` tinyint NOT NULL DEFAULT 1, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `slug` text NOT NULL, `title` varchar(150) NOT NULL, `excerpt` varchar(255) NOT NULL, `content` text NOT NULL, `category` varchar(100) NULL, `tags` text NOT NULL, `status` tinyint NOT NULL DEFAULT 1, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `author` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `posts` ADD CONSTRAINT `FK_d03fb91772937997f010466a007` FOREIGN KEY (`author`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` DROP FOREIGN KEY `FK_d03fb91772937997f010466a007`");
        await queryRunner.query("DROP TABLE `posts`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
