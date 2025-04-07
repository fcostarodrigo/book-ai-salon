import { serve } from "bun";
import { type ConversationItem, prompt, transcribe } from "./backend/ai";
import {
  createBooking,
  createPrompt,
  createUser,
  getBookings,
  getPrompts,
  getServices,
  getSlots,
  getStudios,
  getStylists,
  getStylistServices,
  getStylistSlots,
  getUsers,
  removeBooking,
} from "./backend/database";
import index from "./frontend/index.html";
import { newBookingSchema, newUserSchema, promptRequestSchema } from "./model";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/studios": {
      GET() {
        return Response.json(getStudios());
      },
    },

    "/api/stylists": {
      GET() {
        return Response.json(getStylists());
      },
    },

    "/api/stylists/:stylistId/services": {
      GET(req) {
        const { stylistId } = req.params;

        return Response.json(getStylistServices(stylistId));
      },
    },

    "/api/stylists/:stylistId/slots": {
      GET(req) {
        const { stylistId } = req.params;

        return Response.json(getStylistSlots(stylistId));
      },
    },

    "/api/services": {
      GET() {
        return Response.json(getServices());
      },
    },

    "/api/users": {
      GET() {
        return Response.json(getUsers());
      },

      async POST(req) {
        const newUser = newUserSchema.parse(await req.json());
        const userId = crypto.randomUUID();
        const user = { ...newUser, userId };

        createUser(user);

        return Response.json(user);
      },
    },

    "/api/slots": {
      GET(req) {
        const { searchParams } = new URL(req.url);
        const start = searchParams.get("start") ?? undefined;
        const end = searchParams.get("end") ?? undefined;

        return Response.json(getSlots({ start, end }));
      },
    },

    "/api/bookings": {
      GET() {
        return Response.json(getBookings());
      },

      async POST(req) {
        const newBooking = newBookingSchema.parse(await req.json());
        const bookingId = crypto.randomUUID();
        const booking = { ...newBooking, bookingId };

        createBooking(booking);

        return Response.json(booking);
      },
    },

    "/api/bookings/:bookingId": {
      DELETE(req) {
        const { bookingId } = req.params;

        removeBooking(bookingId);

        return Response.json({ bookingId });
      },
    },

    "/api/transcriptions": {
      async POST(req) {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
          return new Response("No file uploaded", { status: 400 });
        }

        const transcription = await transcribe(file);

        return Response.json({ transcription });
      },
    },

    "/api/prompt": {
      async POST(req) {
        const { query, conversationId } = promptRequestSchema.parse(await req.json());
        const conversation: ConversationItem[] = [];

        if (conversationId !== undefined) {
          for (const savedPrompt of getPrompts(conversationId)) {
            conversation.push({ query: savedPrompt.query, response: savedPrompt.response });
          }
        }

        conversation.push({ query });

        const newPrompt = {
          promptId: crypto.randomUUID(),
          query,
          response: await prompt(conversation),
          conversationId: conversationId ?? crypto.randomUUID(),
        };

        createPrompt(newPrompt);

        return Response.json(newPrompt);
      },
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
