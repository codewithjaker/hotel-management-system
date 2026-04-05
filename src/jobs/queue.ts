import Queue from "bull";
import { getRedisClient } from "../config/redis";
import { env } from "../config/env";

// Create a connection to Redis using the same client
const redisUrl = env.REDIS_URL;

// Define queues
export const emailQueue = new Queue("email", redisUrl);
export const bookingCleanupQueue = new Queue("booking-cleanup", redisUrl);
export const pricingSyncQueue = new Queue("pricing-sync", redisUrl);

// Processors (to be defined in separate files)
emailQueue.process(async (job) => {
  const { to, subject, html } = job.data;
  // Implement email sending logic (nodemailer)
  console.log(`Sending email to ${to}`);
});

bookingCleanupQueue.process(async (job) => {
  // Cancel pending reservations older than 24h
  const { Reservation } = await import("../modules/booking/reservation.model");
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await Reservation.updateMany(
    { status: "pending", createdAt: { $lt: cutoff } },
    { status: "cancelled", cancellationReason: "Auto-cancelled by system" }
  );
});

pricingSyncQueue.process(async (job) => {
  // Sync rates from external channel manager (placeholder)
  console.log("Syncing pricing from external source");
});

// Add recurring jobs (using cron-like syntax)
// For example, run booking cleanup every hour
bookingCleanupQueue.add({}, { repeat: { cron: "0 * * * *" } });