import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordResetEntityUsedFieldTypeChange1604242703144 implements MigrationInterface {
    name = 'passwordResetEntityUsedFieldTypeChange1604242703144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `used` `used` tinyint NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `used` `used` tinyint(1) NOT NULL DEFAULT '1'");
    }

}
