-- CreateTable
CREATE TABLE "manager_trainings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manager_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "valid_from" DATE NOT NULL,
    "valid_until" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "registration_link" TEXT,
    "contact" TEXT,
    "contact_people" TEXT,
    "validated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manager_trainings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manager_trainings_manager_created" ON "manager_trainings"("manager_id", "created_at");

-- CreateIndex
CREATE INDEX "manager_trainings_valid_until" ON "manager_trainings"("valid_until");

-- AddForeignKey
ALTER TABLE "manager_trainings" ADD CONSTRAINT "manager_trainings_manager_id_members_id_fk" FOREIGN KEY ("manager_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
