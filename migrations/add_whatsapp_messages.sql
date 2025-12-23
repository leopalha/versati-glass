-- Migration: Add WhatsAppMessage model
-- Date: 2024-12-23
-- Description: Creates dedicated table for WhatsApp messages

-- Create whatsapp_messages table
CREATE TABLE IF NOT EXISTS "whatsapp_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL UNIQUE,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "status" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "whatsapp_messages_conversationId_fkey"
        FOREIGN KEY ("conversationId")
        REFERENCES "conversations"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "whatsapp_messages_conversationId_idx" ON "whatsapp_messages"("conversationId");
CREATE INDEX IF NOT EXISTS "whatsapp_messages_messageId_idx" ON "whatsapp_messages"("messageId");
CREATE INDEX IF NOT EXISTS "whatsapp_messages_timestamp_idx" ON "whatsapp_messages"("timestamp");
CREATE UNIQUE INDEX IF NOT EXISTS "whatsapp_messages_messageId_key" ON "whatsapp_messages"("messageId");
