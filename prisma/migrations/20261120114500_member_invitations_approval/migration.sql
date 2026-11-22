CREATE TYPE "approval_status" AS ENUM ('pending', 'approved', 'rejected');

ALTER TABLE "members"
ADD COLUMN "approval_status" "approval_status" NOT NULL DEFAULT 'approved';

CREATE TABLE "member_invitations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "role" "account_role" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "created_by_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "accepted_at" TIMESTAMPTZ(6),
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_invitations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "member_invitations_token_hash" ON "member_invitations"("token_hash");
CREATE INDEX "member_invitations_email" ON "member_invitations"("email");
CREATE INDEX "member_invitations_created_by" ON "member_invitations"("created_by_id");

ALTER TABLE "member_invitations"
ADD CONSTRAINT "member_invitations_created_by_id_members_id_fk"
FOREIGN KEY ("created_by_id") REFERENCES "members"("id")
ON DELETE CASCADE ON UPDATE NO ACTION;
