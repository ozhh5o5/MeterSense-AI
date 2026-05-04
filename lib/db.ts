import { PrismaClient } from "@prisma/client";
import { existsSync, copyFileSync, mkdirSync } from "fs";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrl(): string {
  // On Vercel (read-only FS), copy the pre-seeded DB to /tmp
  if (process.env.VERCEL) {
    const srcDb = path.join(process.cwd(), "prisma", "metersense.db");
    const tmpDir = "/tmp/prisma";
    const tmpDb = path.join(tmpDir, "metersense.db");

    if (!existsSync(tmpDb) && existsSync(srcDb)) {
      mkdirSync(tmpDir, { recursive: true });
      copyFileSync(srcDb, tmpDb);
    }
    if (existsSync(tmpDb)) {
      return `file:${tmpDb}`;
    }
  }
  return `file:${path.join(process.cwd(), "prisma", "metersense.db")}`;
}

function createClient(): PrismaClient {
  const url = getDatabaseUrl();
  return new PrismaClient({
    datasources: { db: { url } },
  });
}

export const db = globalThis.prisma || createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
