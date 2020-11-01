import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordResetEntityPasswordRecoveryPinChangeFieldNameToPin1604244825763 implements MigrationInterface {
    name = 'passwordResetEntityPasswordRecoveryPinChangeFieldNameToPin1604244825763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `password_recovery_pin` `pin` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `password_reset` CHANGE `pin` `password_recovery_pin` int NOT NULL");
    }

}
