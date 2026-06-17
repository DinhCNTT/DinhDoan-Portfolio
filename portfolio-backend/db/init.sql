-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create Projects Table
CREATE TABLE IF NOT EXISTS "Projects" (
    "Id" UUID PRIMARY KEY,
    "Title" VARCHAR(255) NOT NULL,
    "Description" TEXT NOT NULL,
    "ImageUrl" VARCHAR(500) NOT NULL,
    "GithubUrl" VARCHAR(500) NOT NULL,
    "LiveUrl" VARCHAR(500) NOT NULL,
    "Tags" VARCHAR(500) NOT NULL,
    "ProblemDescription" TEXT NOT NULL,
    "SolutionDescription" TEXT NOT NULL,
    "ResultDescription" TEXT NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Skills Table
CREATE TABLE IF NOT EXISTS "Skills" (
    "Id" UUID PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Category" VARCHAR(100) NOT NULL,
    "Level" INT NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create CvEmbeddings Table for RAG Chatbot
CREATE TABLE IF NOT EXISTS "CvEmbeddings" (
    "Id" UUID PRIMARY KEY,
    "Title" VARCHAR(255) NOT NULL,
    "Content" TEXT NOT NULL,
    "Embedding" VECTOR(768), -- Gemini text-embedding-004 output size
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create ChatMessages Table for QA Logging
CREATE TABLE IF NOT EXISTS "ChatMessages" (
    "Id" UUID PRIMARY KEY,
    "SessionId" VARCHAR(100) NOT NULL,
    "Role" VARCHAR(50) NOT NULL,
    "Content" TEXT NOT NULL,
    "LatencyMs" BIGINT NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create HNSW Index on CvEmbeddings for fast Cosine Distance search
-- HNSW is highly recommended for production-grade vector search
CREATE INDEX IF NOT EXISTS "IX_CvEmbeddings_Embedding" 
ON "CvEmbeddings" 
USING hnsw ("Embedding" vector_cosine_ops);
