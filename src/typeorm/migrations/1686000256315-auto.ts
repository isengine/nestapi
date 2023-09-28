import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1686000256315 implements MigrationInterface {
    name = 'Auto1686000256315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "common_entity" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7fec8b23c7862968df32e9abeff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students_groups" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "description" character varying(200), "icon" character varying(2048), "user_id" bigint, CONSTRAINT "PK_f8610915607c779d258454f5c9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "pack_id" bigint, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "packs" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "description" character varying(200), "icon" character varying(2048), CONSTRAINT "PK_da3c6e998aaa9331767c51e7f91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "all" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "published_at" TIMESTAMP, "blocked_at" TIMESTAMP, "is_done" boolean NOT NULL DEFAULT false, "is_show_results" boolean NOT NULL DEFAULT false, "user_id" bigint, "student_id" bigint, "test_id" bigint, "battery_id" bigint, CONSTRAINT "PK_f38fee04610973baf6ae59f90ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interpretations" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying(100), "score" integer, "score_from" integer, "score_to" integer, "description" text, "test_id" bigint, CONSTRAINT "PK_ce8b33742202f71f0f62678bc8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tests" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(200), "description" character varying(200), "icon" character varying(2048), "pack_id" bigint, "category_id" bigint, CONSTRAINT "PK_4301ca51edf839623386860aed2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "results" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "data" json, "test_id" bigint, "student_id" bigint, CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(50), "student_id" bigint, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."students_gender_enum" AS ENUM('', 'm', 'w')`);
        await queryRunner.query(`CREATE TABLE "students" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(300), "email" character varying(200), "phone" integer, "avatar" character varying(2048), "birthday" TIMESTAMP, "gender" "public"."students_gender_enum" NOT NULL DEFAULT '', "user_id" bigint, CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "batteries" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "description" character varying(200), "icon" character varying(2048), "user_id" bigint, CONSTRAINT "PK_15c3822438d1c3deafa50cc8859" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blank_tests" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), CONSTRAINT "PK_8ab0ae0fb52afa922e898bca517" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_tests" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), CONSTRAINT "PK_4b6a0d1a40e29e917e6fe0fb2d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(300), "email" character varying(200), "phone" integer, "avatar" character varying(2048), "birthday" TIMESTAMP, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthday" TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('', 'm', 'w')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" "public"."users_gender_enum" NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "students_groups" ADD CONSTRAINT "FK_f9a0d4ab8d15ed274a8aafe2922" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_6a88053002330a6a65203af941d" FOREIGN KEY ("pack_id") REFERENCES "packs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "all" ADD CONSTRAINT "FK_3c7df136badf2106cff624211c4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "all" ADD CONSTRAINT "FK_8e594be72709d45446cdee30823" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "all" ADD CONSTRAINT "FK_fbbc3b0e60f96a9b1fd40e4db54" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "all" ADD CONSTRAINT "FK_7d80b7340f288470b6e4ff2eb1b" FOREIGN KEY ("battery_id") REFERENCES "batteries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interpretations" ADD CONSTRAINT "FK_1d077ea4b675bb67356f8ec052f" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_aacea2771b0aeb3263313df2943" FOREIGN KEY ("pack_id") REFERENCES "packs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_13bfe0fc818e4966575f0b83195" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_47aba24285044c104709127779e" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_7c5bf104ec5fbc6d177be01af8e" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_297f473f291b15592fc13d3cf89" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batteries" ADD CONSTRAINT "FK_6b9317a81c229d64f77e6c06fa3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batteries" DROP CONSTRAINT "FK_6b9317a81c229d64f77e6c06fa3"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_297f473f291b15592fc13d3cf89"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_7c5bf104ec5fbc6d177be01af8e"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_47aba24285044c104709127779e"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_13bfe0fc818e4966575f0b83195"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_aacea2771b0aeb3263313df2943"`);
        await queryRunner.query(`ALTER TABLE "interpretations" DROP CONSTRAINT "FK_1d077ea4b675bb67356f8ec052f"`);
        await queryRunner.query(`ALTER TABLE "all" DROP CONSTRAINT "FK_7d80b7340f288470b6e4ff2eb1b"`);
        await queryRunner.query(`ALTER TABLE "all" DROP CONSTRAINT "FK_fbbc3b0e60f96a9b1fd40e4db54"`);
        await queryRunner.query(`ALTER TABLE "all" DROP CONSTRAINT "FK_8e594be72709d45446cdee30823"`);
        await queryRunner.query(`ALTER TABLE "all" DROP CONSTRAINT "FK_3c7df136badf2106cff624211c4"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_6a88053002330a6a65203af941d"`);
        await queryRunner.query(`ALTER TABLE "students_groups" DROP CONSTRAINT "FK_f9a0d4ab8d15ed274a8aafe2922"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP TABLE "game_tests"`);
        await queryRunner.query(`DROP TABLE "blank_tests"`);
        await queryRunner.query(`DROP TABLE "batteries"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TYPE "public"."students_gender_enum"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "results"`);
        await queryRunner.query(`DROP TABLE "tests"`);
        await queryRunner.query(`DROP TABLE "interpretations"`);
        await queryRunner.query(`DROP TABLE "all"`);
        await queryRunner.query(`DROP TABLE "packs"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "students_groups"`);
        await queryRunner.query(`DROP TABLE "common_entity"`);
    }

}
