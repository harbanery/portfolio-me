-- CreateEnum
CREATE TYPE "PortfolioStatus" AS ENUM ('ACTIVE', 'NONACTIVE');

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "status" "PortfolioStatus" NOT NULL DEFAULT 'ACTIVE';
