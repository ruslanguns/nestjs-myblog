import {MigrationInterface, QueryRunner} from "typeorm";

export class userUpdatedAtNewField1604194670020 implements MigrationInterface {
    name = 'userUpdatedAtNewField1604194670020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `updated_at`");
    }

}
