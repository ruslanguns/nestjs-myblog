import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordResetEntityFixPasswordRecoveryPin1604238424532 implements MigrationInterface {
    name = 'passwordResetEntityFixPasswordRecoveryPin1604238424532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `password-recovery-pin` `password_recovery_pin` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `password_recovery_pin` `password-recovery-pin` int NOT NULL");
    }

}
