import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709041453612 implements MigrationInterface {
  name = 'Migration1709041453612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`job\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`refTable\` varchar(255) NULL, \`refId\` int NULL, \`uniqueIdentifier\` varchar(255) NULL, \`status\` varchar(255) NOT NULL DEFAULT 'SCHEDULED', \`scheduledTime\` datetime NOT NULL, \`accessorId\` varchar(255) NULL, \`lastAccessTime\` datetime NULL, INDEX \`IDX_46b8d79c5c2f7f299f1b2c1ddf\` (\`type\`), INDEX \`IDX_04c48ec6dc5877b3773d51b75a\` (\`refTable\`), INDEX \`IDX_9a3a680bfd0a2d7fdadd6a884c\` (\`refId\`), INDEX \`IDX_bac37f13b06c08534012dc3607\` (\`status\`), INDEX \`IDX_fbcf21bea9d39656b9602b6b45\` (\`scheduledTime\`), INDEX \`IDX_75c60fda02b5462bf6787d226e\` (\`accessorId\`), INDEX \`IDX_903e5116c43e2be8e620655b57\` (\`lastAccessTime\`), UNIQUE INDEX \`IDX_c51b6763c2fbd91bbc96866eee\` (\`uniqueIdentifier\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`birthdayDate\` varchar(255) NOT NULL, \`birthdayLocation\` varchar(255) NOT NULL, \`localTimezone\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_c51b6763c2fbd91bbc96866eee\` ON \`job\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_903e5116c43e2be8e620655b57\` ON \`job\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_75c60fda02b5462bf6787d226e\` ON \`job\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fbcf21bea9d39656b9602b6b45\` ON \`job\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bac37f13b06c08534012dc3607\` ON \`job\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9a3a680bfd0a2d7fdadd6a884c\` ON \`job\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_04c48ec6dc5877b3773d51b75a\` ON \`job\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_46b8d79c5c2f7f299f1b2c1ddf\` ON \`job\``,
    );
    await queryRunner.query(`DROP TABLE \`job\``);
  }
}
