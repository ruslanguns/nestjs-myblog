import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordResetEntityFixPasswordRecoveryPin1604238394925 implements MigrationInterface {
    name = 'passwordResetEntityFixPasswordRecoveryPin1604238394925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `password-recovery-path` `password-recovery-pin` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `password-recovery-pin` `password-recovery-path` int NOT NULL");
    }

}
