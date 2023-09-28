import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1686030749384 implements MigrationInterface {
    name = 'Auto1686030749384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students_students_groups_students_groups" ("studentsId" bigint NOT NULL, "studentsGroupsId" bigint NOT NULL, CONSTRAINT "PK_c3f0e8c215e6b972000336a3927" PRIMARY KEY ("studentsId", "studentsGroupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1af96309c9a7d0f977e71be175" ON "students_students_groups_students_groups" ("studentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5497db8cdf1a696b924dfcf417" ON "students_students_groups_students_groups" ("studentsGroupsId") `);
        await queryRunner.query(`CREATE TABLE "tests_batteries_batteries" ("testsId" bigint NOT NULL, "batteriesId" bigint NOT NULL, CONSTRAINT "PK_7fa9fcc1f190008e23547a390c3" PRIMARY KEY ("testsId", "batteriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_578b381410d8eb50b0c2fcdc3b" ON "tests_batteries_batteries" ("testsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c9123e294edb7d7a0ce6f2a5d" ON "tests_batteries_batteries" ("batteriesId") `);
        await queryRunner.query(`ALTER TABLE "students_students_groups_students_groups" ADD CONSTRAINT "FK_1af96309c9a7d0f977e71be1757" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "students_students_groups_students_groups" ADD CONSTRAINT "FK_5497db8cdf1a696b924dfcf4170" FOREIGN KEY ("studentsGroupsId") REFERENCES "students_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests_batteries_batteries" ADD CONSTRAINT "FK_578b381410d8eb50b0c2fcdc3bd" FOREIGN KEY ("testsId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tests_batteries_batteries" ADD CONSTRAINT "FK_9c9123e294edb7d7a0ce6f2a5d7" FOREIGN KEY ("batteriesId") REFERENCES "batteries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests_batteries_batteries" DROP CONSTRAINT "FK_9c9123e294edb7d7a0ce6f2a5d7"`);
        await queryRunner.query(`ALTER TABLE "tests_batteries_batteries" DROP CONSTRAINT "FK_578b381410d8eb50b0c2fcdc3bd"`);
        await queryRunner.query(`ALTER TABLE "students_students_groups_students_groups" DROP CONSTRAINT "FK_5497db8cdf1a696b924dfcf4170"`);
        await queryRunner.query(`ALTER TABLE "students_students_groups_students_groups" DROP CONSTRAINT "FK_1af96309c9a7d0f977e71be1757"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c9123e294edb7d7a0ce6f2a5d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_578b381410d8eb50b0c2fcdc3b"`);
        await queryRunner.query(`DROP TABLE "tests_batteries_batteries"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5497db8cdf1a696b924dfcf417"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1af96309c9a7d0f977e71be175"`);
        await queryRunner.query(`DROP TABLE "students_students_groups_students_groups"`);
    }

}
