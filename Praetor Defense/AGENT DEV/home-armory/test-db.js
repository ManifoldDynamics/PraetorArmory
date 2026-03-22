const path = require('path');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');

try {
  const dbPath = path.join(process.cwd(), 'dev.db');
  console.log("DB Path:", dbPath);
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter });

  prisma.firearm.count().then(count => {
    console.log("Success! Count:", count);
  }).catch(e => console.error("Query Error:", e));
} catch(e) {
  console.error("Init Error:", e);
}
