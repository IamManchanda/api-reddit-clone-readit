const {
  NODE_ENV,
  DB_DIALECT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
} = process.env;

const rootDir = NODE_ENV === "development" ? "src" : "build";

module.exports = {
  type: DB_DIALECT,
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  logging: NODE_ENV === "development",
  entities: [`${rootDir}/entities/**/*{.ts,.js}`],
  migrations: [`${rootDir}/migrations/**/*{.ts,.js}`],
  subscribers: [`${rootDir}/subscribers/**/*{.ts,.js}`],
  seeds: [`${rootDir}/seeds/**/*{.ts,.js}`],
  cli: {
    entitiesDir: `${rootDir}/entities`,
    migrationsDir: `${rootDir}/migrations`,
    subscribersDir: `${rootDir}/subscribers`,
  },
};
