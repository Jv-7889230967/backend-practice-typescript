-- -- DropIndex
-- DROP INDEX "User_interests_idx";

-- -- AlterTable
-- ALTER TABLE "User" ADD COLUMN "search_vector" tsvector;

-- ALTER TABLE "User"
-- ALTER COLUMN search_vector
-- SET
--     GENERATED ALWAYS AS (
--         to_tsvector(
--             'english',
--             COALESCE(name, '') || ' ' || COALESCE(
--                 array_to_string(interests, ' '),
--                 ''
--             ) || ' '
--         )
--     ) STORED;

-- -- CreateIndex
-- CREATE INDEX "User_search_vector_idx" ON "User" USING GIN ("search_vector");


ALTER TABLE "User" DROP COLUMN search_vector;
ALTER TABLE "User"
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector(
        'english',
        COALESCE(name, '') || ' ' ||
        COALESCE(array_to_string(interests, ' '), '')
    )
) STORED;
CREATE INDEX "User_search_vector_idx"
ON "User" USING GIN (search_vector);
