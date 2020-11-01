import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordResetEntityAdded1604238330588 implements MigrationInterface {
    name = 'passwordResetEntityAdded1604238330588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `password_reset` (`id` int NOT NULL AUTO_INCREMENT, `password-recovery-path` int NOT NULL, `used` tinyint NOT NULL DEFAULT 1, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `password_reset` ADD CONSTRAINT `FK_05baebe80e9f8fab8207eda250c` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` DROP FOREIGN KEY `FK_05baebe80e9f8fab8207eda250c`");
        await queryRunner.query("DROP TABLE `password_reset`");
    }

}
