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

export const newBookingSchema = z.object({
  userId: z.string(),
  slotId: z.string(),
  serviceId: z.string(),
});

export type NewBooking = z.infer<typeof newBookingSchema>;

export interface Booking {
  bookingId: string;
  slotId: string;
  userId: string;
  serviceId: string;
}
