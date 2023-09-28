import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1688388994559 implements MigrationInterface {
    name = 'Auto1688388994559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appoints" DROP CONSTRAINT "FK_151d28f1bc467d037a9b2d9daec"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP CONSTRAINT "FK_826f0ccbb499d1c5cec80763abd"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP CONSTRAINT "FK_d62d6bb36d87c9ad5eddfabc098"`);
        await queryRunner.query(`CREATE TABLE "students_by_appoints" ("studentsId" bigint NOT NULL, "appointsId" bigint NOT NULL, CONSTRAINT "PK_539fcedf94d701667a5ee4972c9" PRIMARY KEY ("studentsId", "appointsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0be2961b9fe6415a79937189cc" ON "students_by_appoints" ("studentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a99815835cb4021baf910dea09" ON "students_by_appoints" ("appointsId") `);
        await queryRunner.query(`CREATE TABLE "tests_by_appoints" ("testsId" bigint NOT NULL, "appointsId" bigint NOT NULL, CONSTRAINT "PK_f813daf8b31d2224d55e935051b" PRIMARY KEY ("testsId", "appointsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0047b5ab9ccac80321735d193" ON "tests_by_appoints" ("testsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d356a28fd6846435877b7e1d7a" ON "tests_by_appoints" ("appointsId") `);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "published_at"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "blocked_at"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "is_done"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "student_id"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "test_id"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "battery_id"`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "description" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "icon" character varying(2048)`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "start_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "finish_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "is_datetime_limit" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "is_deny_repeat" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "students_by_appoints" ADD CONSTRAINT "FK_0be2961b9fe6415a79937189ccd" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "students_by_appoints" ADD CONSTRAINT "FK_a99815835cb4021baf910dea09e" FOREIGN KEY ("appointsId") REFERENCES "appoints"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests_by_appoints" ADD CONSTRAINT "FK_c0047b5ab9ccac80321735d193c" FOREIGN KEY ("testsId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tests_by_appoints" ADD CONSTRAINT "FK_d356a28fd6846435877b7e1d7a0" FOREIGN KEY ("appointsId") REFERENCES "appoints"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests_by_appoints" DROP CONSTRAINT "FK_d356a28fd6846435877b7e1d7a0"`);
        await queryRunner.query(`ALTER TABLE "tests_by_appoints" DROP CONSTRAINT "FK_c0047b5ab9ccac80321735d193c"`);
        await queryRunner.query(`ALTER TABLE "students_by_appoints" DROP CONSTRAINT "FK_a99815835cb4021baf910dea09e"`);
        await queryRunner.query(`ALTER TABLE "students_by_appoints" DROP CONSTRAINT "FK_0be2961b9fe6415a79937189ccd"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "is_deny_repeat"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "is_datetime_limit"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "finish_at"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "start_at"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "battery_id" bigint`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "test_id" bigint`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "student_id" bigint`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "is_done" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "blocked_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD "published_at" TIMESTAMP`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d356a28fd6846435877b7e1d7a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0047b5ab9ccac80321735d193"`);
        await queryRunner.query(`DROP TABLE "tests_by_appoints"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a99815835cb4021baf910dea09"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0be2961b9fe6415a79937189cc"`);
        await queryRunner.query(`DROP TABLE "students_by_appoints"`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD CONSTRAINT "FK_d62d6bb36d87c9ad5eddfabc098" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD CONSTRAINT "FK_826f0ccbb499d1c5cec80763abd" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appoints" ADD CONSTRAINT "FK_151d28f1bc467d037a9b2d9daec" FOREIGN KEY ("battery_id") REFERENCES "batteries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
