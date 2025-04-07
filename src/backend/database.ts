import { Database } from "bun:sqlite";
import type { Booking, Payment, Prompt, Service, Studio, Stylist, User } from "@/model";

const db = new Database("database.sqlite", { strict: true });

const studiosQuery = db.query("SELECT * FROM studios");

export const getStudios = () => studiosQuery.all();

const stylistsQuery = db.query(`
  SELECT * FROM stylists
    LEFT JOIN studios ON stylists.studioId = studios.studioId
`);

export const getStylists = () => stylistsQuery.all() as (Studio & Stylist)[];

const servicesQuery = db.query("SELECT * FROM services");

export const getServices = () => servicesQuery.all();

const stylistServicesQuery = db.query(`
  SELECT
    services.serviceId,
    services.serviceName
  FROM stylistServices
    LEFT JOIN services on stylistServices.serviceId = services.serviceId
    WHERE stylistId = $styleId
`);

export const getStylistServices = (styleId: string) => {
  return stylistServicesQuery.all({ styleId }) as Service[];
};

const stylistSlotsQuery = db.query(`
  SELECT
    slots.slotId,
    slots.startTime,
    slots.endTime
  FROM slots
    WHERE stylistId = $styleId
`);

export const getStylistSlots = (styleId: string) => stylistSlotsQuery.all({ styleId });

const usersQuery = db.query("SELECT * FROM users");

export const getUsers = () => usersQuery.all();

const createUserQuery = db.query(`
  INSERT INTO users (userId, userName) VALUES ($userId, $userName)
`);

export const createUser = (user: User) => createUserQuery.get({ ...user });

const createPaymentQuery = db.query(`
  INSERT INTO payments (paymentId, paymentToken, userId) VALUES ($paymentId, $paymentToken, $userId)
`);

export const createPayment = (payment: Payment) => createPaymentQuery.get({ ...payment });

const paymentTokenQuery = db.query(`
  SELECT * FROM payments WHERE paymentToken = $paymentToken
`);

export const getPaymentByPaymentToken = (paymentToken: string) => {
  return paymentTokenQuery.get({ paymentToken }) as Payment | null;
};

const slotsQuery = db.query(`
  SELECT
    slots.slotId,
    slots.startTime,
    slots.endTime,
    stylists.stylistId,
    stylists.stylistName,
    studios.studioId,
    studios.studioName,
    services.serviceId,
    services.serviceName,
    bookings.bookingId,
    bookings.userId
  FROM slots
    LEFT JOIN stylists ON slots.stylistId = stylists.stylistId
    LEFT JOIN studios ON stylists.studioId = studios.studioId
    LEFT JOIN stylistServices ON slots.stylistId = stylistServices.stylistId
    LEFT JOIN services ON services.serviceId = stylistServices.serviceId
    LEFT JOIN bookings ON slots.slotId = bookings.slotId
    LEFT JOIN users ON users.userId = bookings.userId
  WHERE
    (startTime >= $start AND endTime <= $end)
`);

export const getSlots = ({ start = "2000-01-01T00:00:00", end = "3000-01-01T00:00:00" }) => {
  return slotsQuery.all({ start, end });
};

const freeSlotsQuery = db.query(`
  SELECT
    slots.slotId,
    slots.startTime,
    slots.endTime,
    stylists.stylistId,
    stylists.stylistName,
    studios.studioName,
    services.serviceId,
    services.serviceName
  FROM slots
    LEFT JOIN stylists ON slots.stylistId = stylists.stylistId
    LEFT JOIN studios ON stylists.studioId = studios.studioId
    LEFT JOIN stylistServices ON slots.stylistId = stylistServices.stylistId
    LEFT JOIN services ON services.serviceId = stylistServices.serviceId
    LEFT JOIN bookings ON slots.slotId = bookings.slotId
  WHERE
    bookings.bookingId IS NULL
`);

export const getFreeSlots = () => freeSlotsQuery.all();

const bookingSlotQuery = db.query(`
  SELECT
    slots.slotId,
    bookings.bookingId
  FROM slots
    LEFT JOIN bookings ON slots.slotId = bookings.slotId
  WHERE
    slots.slotId = $slotId
`);

export const getBookingSlot = (slotId: string) => {
  return bookingSlotQuery.get({ slotId }) as { slotId: string; bookingId: string | null } | null;
};

const bookingsQuery = db.query("SELECT * FROM bookings");

export const getBookings = () => bookingsQuery.all();

const createBookingQuery = db.query(`
  INSERT INTO bookings (bookingId, slotId, userId, serviceId, paymentId) VALUES
    ($bookingId, $slotId, $userId, $serviceId, $paymentId)
`);

export const createBooking = (booking: Booking) => createBookingQuery.get({ ...booking });

const removeBookingQuery = db.query(`
  DELETE FROM bookings WHERE bookingId = $bookingId
`);

export const removeBooking = (bookingId: string) => removeBookingQuery.get({ bookingId });

const promptQuery = db.query(`
  SELECT * FROM prompts WHERE conversationId = $conversationId
`);

export const getPrompts = (conversationId: string) => {
  return promptQuery.all({ conversationId }) as Prompt[];
};

const createPromptQuery = db.query(`
  INSERT INTO prompts (promptId, query, response, conversationId) VALUES
    ($promptId, $query, $response, $conversationId)
`);

export const createPrompt = (prompt: Prompt) => createPromptQuery.run({ ...prompt });
