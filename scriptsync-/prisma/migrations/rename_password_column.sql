-- Rename the password column to hashedPassword
ALTER TABLE "User" RENAME COLUMN "password" TO "hashedPassword"; 