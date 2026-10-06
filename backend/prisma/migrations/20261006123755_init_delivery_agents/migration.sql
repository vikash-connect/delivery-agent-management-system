-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "delivery_agents" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "serviceArea" TEXT NOT NULL,
    "status" "AgentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivery_agents_phoneNumber_key" ON "delivery_agents"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_agents_email_key" ON "delivery_agents"("email");

-- CreateIndex
CREATE INDEX "delivery_agents_status_idx" ON "delivery_agents"("status");

-- CreateIndex
CREATE INDEX "delivery_agents_serviceArea_idx" ON "delivery_agents"("serviceArea");

-- CreateIndex
CREATE INDEX "delivery_agents_fullName_idx" ON "delivery_agents"("fullName");
