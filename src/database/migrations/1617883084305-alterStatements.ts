import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class alterStatements1617883084305 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        "statements",
        new TableColumn({
          name:"sender_id",
          type:"uuid"
        })

      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements","sender_id");
    }

}
