-- CreateEnum
CREATE TYPE "ManagerExamType" AS ENUM ('examen', 'concours');

-- CreateTable
CREATE TABLE "manager_exam_concours" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manager_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ManagerExamType" NOT NULL,
    "valid_from" DATE NOT NULL,
    "valid_until" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "ministry" TEXT,
    "document_url" TEXT,
    "document_name" TEXT,
    "validated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manager_exam_concours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manager_exam_concours_manager_created" ON "manager_exam_concours"("manager_id", "created_at");

-- CreateIndex
CREATE INDEX "manager_exam_concours_type_created" ON "manager_exam_concours"("type", "created_at");

-- AddForeignKey
ALTER TABLE "manager_exam_concours" ADD CONSTRAINT "manager_exam_concours_manager_id_members_id_fk" FOREIGN KEY ("manager_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
