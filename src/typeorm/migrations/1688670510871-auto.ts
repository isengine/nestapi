import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1688670510871 implements MigrationInterface {
    name = 'Auto1688670510871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appoints" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "description" character varying(200), "icon" character varying(2048), "start_at" TIMESTAMP, "finish_at" TIMESTAMP, "is_datetime_limit" boolean NOT NULL DEFAULT false, "is_deny_repeat" boolean NOT NULL DEFAULT false, "is_show_results" boolean NOT NULL DEFAULT false, "user_id" bigint, CONSTRAINT "PK_3cdfd5e9cddb5b5c234a5936d14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students_by_appoints" ("studentsId" bigint NOT NULL, "appointsId" bigint NOT NULL, CONSTRAINT "PK_e2ef917670de7d63694f63ac583" PRIMARY KEY ("studentsId", "appointsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a32231442741fe4635b4df6f82" ON "students_by_appoints" ("studentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4f11d9ba1ceac2d22d781d3c0b" ON "students_by_appoints" ("appointsId") `);
        await queryRunner.query(`CREATE TABLE "tests_by_appoints" ("testsId" bigint NOT NULL, "appointsId" bigint NOT NULL, CONSTRAINT "PK_e8d238e60640e6f6b384349a4e4" PRIMARY KEY ("testsId", "appointsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e6315fb04569dfa7830a49fa5d" ON "tests_by_appoints" ("testsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2773177055bc10e06293e5f328" ON "tests_by_appoints" ("appointsId") `);
        await queryRunner.query(`ALTER TABLE "appoints" ADD CONSTRAINT "FK_eeec10f8ef536c6a5c596b41fad" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students_by_appoints" ADD CONSTRAINT "FK_a32231442741fe4635b4df6f824" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "students_by_appoints" ADD CONSTRAINT "FK_4f11d9ba1ceac2d22d781d3c0b1" FOREIGN KEY ("appointsId") REFERENCES "appoints"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests_by_appoints" ADD CONSTRAINT "FK_e6315fb04569dfa7830a49fa5d8" FOREIGN KEY ("testsId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tests_by_appoints" ADD CONSTRAINT "FK_2773177055bc10e06293e5f3284" FOREIGN KEY ("appointsId") REFERENCES "appoints"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests_by_appoints" DROP CONSTRAINT "FK_2773177055bc10e06293e5f3284"`);
        await queryRunner.query(`ALTER TABLE "tests_by_appoints" DROP CONSTRAINT "FK_e6315fb04569dfa7830a49fa5d8"`);
        await queryRunner.query(`ALTER TABLE "students_by_appoints" DROP CONSTRAINT "FK_4f11d9ba1ceac2d22d781d3c0b1"`);
        await queryRunner.query(`ALTER TABLE "students_by_appoints" DROP CONSTRAINT "FK_a32231442741fe4635b4df6f824"`);
        await queryRunner.query(`ALTER TABLE "appoints" DROP CONSTRAINT "FK_eeec10f8ef536c6a5c596b41fad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2773177055bc10e06293e5f328"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e6315fb04569dfa7830a49fa5d"`);
        await queryRunner.query(`DROP TABLE "tests_by_appoints"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f11d9ba1ceac2d22d781d3c0b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a32231442741fe4635b4df6f82"`);
        await queryRunner.query(`DROP TABLE "students_by_appoints"`);
        await queryRunner.query(`DROP TABLE "appoints"`);
    }

}
