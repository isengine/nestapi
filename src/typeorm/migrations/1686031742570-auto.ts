import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1686031742570 implements MigrationInterface {
    name = 'Auto1686031742570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appoints" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "published_at" TIMESTAMP, "blocked_at" TIMESTAMP, "is_done" boolean NOT NULL DEFAULT false, "is_show_results" boolean NOT NULL DEFAULT false, "user_id" bigint, "student_id" bigint, "test_id" bigint, "battery_id" bigint, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD CONSTRAINT "FK_66dee3bea82328659a4db8e54b7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD CONSTRAINT "FK_d62d6bb36d87c9ad5eddfabc098" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD CONSTRAINT "FK_826f0ccbb499d1c5cec80763abd" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD CONSTRAINT "FK_151d28f1bc467d037a9b2d9daec" FOREIGN KEY ("battery_id") REFERENCES "batteries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appoints" DROP CONSTRAINT "FK_151d28f1bc467d037a9b2d9daec"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP CONSTRAINT "FK_826f0ccbb499d1c5cec80763abd"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP CONSTRAINT "FK_d62d6bb36d87c9ad5eddfabc098"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP CONSTRAINT "FK_66dee3bea82328659a4db8e54b7"`);
        await queryRunner.query(`DROP TABLE "appoints"`);
    }

}
