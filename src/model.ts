import { z } from "zod";

export interface Studio {
  studioId: string;
  studioName: string;
}

export interface Stylist {
  stylistId: string;
  stylistName: string;
  studioId: string;
}

export interface Service {
  serviceId: string;
  serviceName: string;
}

export interface User {
  userId: string;
  userName: string;
}

export const newUserSchema = z.object({
  userName: z.string(),
});

export type NewUser = z.infer<typeof newUserSchema>;

export interface Payment {
  paymentId: string;
  paymentToken: string;
  userId: string;
}

export const newPaymentSchema = z.object({
  userId: z.string(),
  paymentCode: z.string(),
});

export const newBookingSchema = z.object({
  userId: z.string(),
  slotId: z.string(),
  serviceId: z.string(),
  paymentId: z.string(),
});

export const newBookingAISchema = z.object({
  userId: z.string(),
  slotId: z.string(),
  serviceId: z.string(),
  paymentToken: z.string(),
});

export type NewBooking = z.infer<typeof newBookingSchema>;

export interface Booking {
  bookingId: string;
  slotId: string;
  userId: string;
  serviceId: string;
  paymentId: string;
}

export const promptRequestSchema = z.object({
  query: z.string(),
  conversationId: z.string().optional(),
});

export const promptResponseSchema = z.object({
  promptId: z.string(),
  query: z.string(),
  response: z.string(),
  conversationId: z.string(),
});

export type promptResponse = z.infer<typeof promptResponseSchema>;

export interface Prompt {
  promptId: string;
  query: string;
  response: string;
  conversationId: string;
}

export const transcriptionResponse = z.object({
  transcription: z.string(),
});
