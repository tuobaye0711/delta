-- CreateTable
CREATE TABLE "bullet_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bulletId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "price_history_bulletId_fkey" FOREIGN KEY ("bulletId") REFERENCES "bullet_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL DEFAULT 'default',
    "bulletId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "total" REAL NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_transactions_bulletId_fkey" FOREIGN KEY ("bulletId") REFERENCES "bullet_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_targets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL DEFAULT 'default',
    "bulletId" INTEGER NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetPrice" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_targets_bulletId_fkey" FOREIGN KEY ("bulletId") REFERENCES "bullet_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "bullet_types_name_key" ON "bullet_types"("name");

-- CreateIndex
CREATE INDEX "price_history_bulletId_createdAt_idx" ON "price_history"("bulletId", "createdAt");

-- CreateIndex
CREATE INDEX "user_transactions_userId_bulletId_idx" ON "user_transactions"("userId", "bulletId");

-- CreateIndex
CREATE INDEX "user_targets_userId_bulletId_idx" ON "user_targets"("userId", "bulletId");
