# TypeORM Migrations

Este directorio contiene las migraciones de base de datos para el proyecto de mascotas perdidas.

## Comandos para trabajar con migraciones

### Generar una nueva migración basada en cambios en las entidades:

```bash
npm run typeorm migration:generate -- -n MigrationName
```

### Crear una migración vacía:

```bash
npm run typeorm migration:create -- -n MigrationName
```

### Ejecutar migraciones pendientes:

```bash
npm run typeorm migration:run
```

### Revertir la última migración:

```bash
npm run typeorm migration:revert
```

## Estructura de una migración

Una migración típica se ve así:

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1234567890123 implements MigrationInterface {
    name = 'MigrationName1234567890123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Código para aplicar los cambios
        await queryRunner.query(`CREATE TABLE ...`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Código para revertir los cambios
        await queryRunner.query(`DROP TABLE ...`);
    }
}
```

## Buenas prácticas

1. Siempre prueba las migraciones en un entorno de desarrollo antes de aplicarlas en producción.
2. Asegúrate de que el método `down()` revierta correctamente los cambios realizados en `up()`.
3. Haz copias de seguridad de la base de datos antes de ejecutar migraciones en producción.
4. Incluye las migraciones en el control de versiones junto con los cambios en las entidades.