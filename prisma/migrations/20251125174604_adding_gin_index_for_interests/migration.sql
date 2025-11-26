-- CreateIndex
CREATE INDEX "User_interests_idx" ON "User" USING GIN ("interests");
