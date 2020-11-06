import {MigrationInterface, QueryRunner} from "typeorm";

export class refreshTokenEntityCreated1604629825363 implements MigrationInterface {
    name = 'refreshTokenEntityCreated1604629825363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `refresh-tokens` (`id` varchar(36) NOT NULL, `refresh_token` varchar(255) NULL DEFAULT '', `issued_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `expiration_time` timestamp NOT NULL, `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `refresh-tokens` ADD CONSTRAINT `FK_36f06086d2187ca909a4cf79030` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `refresh-tokens` DROP FOREIGN KEY `FK_36f06086d2187ca909a4cf79030`");
        await queryRunner.query("DROP TABLE `refresh-tokens`");
    }

}
