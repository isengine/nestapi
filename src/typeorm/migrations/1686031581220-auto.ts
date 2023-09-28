import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1686031581220 implements MigrationInterface {
    name = 'Auto1686031581220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "all" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "published_at" TIMESTAMP, "blocked_at" TIMESTAMP, "is_done" boolean NOT NULL DEFAULT false, "is_show_results" boolean NOT NULL DEFAULT false, "user_id" bigint, "student_id" bigint, "test_id" bigint, "battery_id" bigint, CONSTRAINT "PK_f38fee04610973baf6ae59f90ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students_by_groups" ("studentsId" bigint NOT NULL, "studentsGroupsId" bigint NOT NULL, CONSTRAINT "PK_1c9ce20041ae1537f8f658512f3" PRIMARY KEY ("studentsId", "studentsGroupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_785d7a90ea7599b93880a5a07b" ON "students_by_groups" ("studentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0103a65228b5f7b441593468fb" ON "students_by_groups" ("studentsGroupsId") `);
        await queryRunner.query(`CREATE TABLE "tests_by_batteries" ("testsId" bigint NOT NULL, "batteriesId" bigint NOT NULL, CONSTRAINT "PK_2fe3044c17737992dade589c524" PRIMARY KEY ("testsId", "batteriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ddc90a67842e30eb445fc87898" ON "tests_by_batteries" ("testsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_def51d793c56d134cbd91484b7" ON "tests_by_batteries" ("batteriesId") `);
        await queryRunner.query(`ALTER TABLE "all" ADD CONSTRAINT "FK_3c7df136badf2106cff624211c4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "all" ADD CONSTRAINT "FK_8e594be72709d45446cdee30823" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "all" ADD CONSTRAINT "FK_fbbc3b0e60f96a9b1fd40e4db54" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "all" ADD CONSTRAINT "FK_7d80b7340f288470b6e4ff2eb1b" FOREIGN KEY ("battery_id") REFERENCES "batteries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students_by_groups" ADD CONSTRAINT "FK_785d7a90ea7599b93880a5a07b5" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "students_by_groups" ADD CONSTRAINT "FK_0103a65228b5f7b441593468fbe" FOREIGN KEY ("studentsGroupsId") REFERENCES "students_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests_by_batteries" ADD CONSTRAINT "FK_ddc90a67842e30eb445fc878980" FOREIGN KEY ("testsId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tests_by_batteries" ADD CONSTRAINT "FK_def51d793c56d134cbd91484b7d" FOREIGN KEY ("batteriesId") REFERENCES "batteries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests_by_batteries" DROP CONSTRAINT "FK_def51d793c56d134cbd91484b7d"`);
        await queryRunner.query(`ALTER TABLE "tests_by_batteries" DROP CONSTRAINT "FK_ddc90a67842e30eb445fc878980"`);
        await queryRunner.query(`ALTER TABLE "students_by_groups" DROP CONSTRAINT "FK_0103a65228b5f7b441593468fbe"`);
        await queryRunner.query(`ALTER TABLE "students_by_groups" DROP CONSTRAINT "FK_785d7a90ea7599b93880a5a07b5"`);
        await queryRunner.query(`ALTER TABLE "all" DROP CONSTRAINT "FK_7d80b7340f288470b6e4ff2eb1b"`);
        await queryRunner.query(`ALTER TABLE "all" DROP CONSTRAINT "FK_fbbc3b0e60f96a9b1fd40e4db54"`);
        await queryRunner.query(`ALTER TABLE "all" DROP CONSTRAINT "FK_8e594be72709d45446cdee30823"`);
        await queryRunner.query(`ALTER TABLE "all" DROP CONSTRAINT "FK_3c7df136badf2106cff624211c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_def51d793c56d134cbd91484b7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ddc90a67842e30eb445fc87898"`);
        await queryRunner.query(`DROP TABLE "tests_by_batteries"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0103a65228b5f7b441593468fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_785d7a90ea7599b93880a5a07b"`);
        await queryRunner.query(`DROP TABLE "students_by_groups"`);
        await queryRunner.query(`DROP TABLE "all"`);
    }

}
