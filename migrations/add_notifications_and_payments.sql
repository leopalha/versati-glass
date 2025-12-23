-- Migration: Add notifications and payments tables
-- Created: 2025-12-22

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for notifications
CREATE INDEX IF NOT EXISTS "notifications_userId_isRead_idx" ON notifications("userId", "isRead");

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  method "PaymentMethod" NOT NULL,
  amount DECIMAL(65,30) NOT NULL,
  installments INTEGER NOT NULL DEFAULT 1,
  status "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "externalId" TEXT,
  "paidAt" TIMESTAMP(3),
  notes TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES orders(id) ON DELETE CASCADE
);

-- Add NotificationType enum if not exists
DO $$ BEGIN
    CREATE TYPE "NotificationType" AS ENUM (
        'QUOTE_RECEIVED',
        'QUOTE_ACCEPTED',
        'QUOTE_REJECTED',
        'ORDER_STATUS_CHANGED',
        'PAYMENT_RECEIVED',
        'APPOINTMENT_REMINDER',
        'APPOINTMENT_CONFIRMED',
        'NEW_MESSAGE',
        'SYSTEM'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
