-- Migration: Add DOCUMENT_UPLOADED notification type
-- Date: 2024-12-23
-- Description: Adds new notification type for when customers upload documents

-- Add DOCUMENT_UPLOADED to NotificationType enum
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'DOCUMENT_UPLOADED';
