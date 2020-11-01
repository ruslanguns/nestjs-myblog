import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordResetEntityChangeUserFieldName1604243782282 implements MigrationInterface {
    name = 'passwordResetEntityChangeUserFieldName1604243782282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` DROP FOREIGN KEY `FK_05baebe80e9f8fab8207eda250c`");
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `userId` `user_id` int NULL");
        await queryRunner.query("ALTER TABLE `password_reset` ADD CONSTRAINT `FK_ad88301fdc79593dd222268a8b6` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` DROP FOREIGN KEY `FK_ad88301fdc79593dd222268a8b6`");
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `user_id` `userId` int NULL");
        await queryRunner.query("ALTER TABLE `password_reset` ADD CONSTRAINT `FK_05baebe80e9f8fab8207eda250c` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
