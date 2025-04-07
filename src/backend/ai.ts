import { OpenAI } from "openai";
import { newBookingAISchema, newPaymentSchema, newUserSchema } from "@/model";
import { createBooking, createPayment, createUser, getFreeSlots, getPaymentByPaymentToken, getUsers } from "./database";

const openai = new OpenAI();
const model = "gpt-4o";

export interface ConversationItem {
  query: string;
  response?: string;
}

interface Tool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  implementation: (arg: unknown) => Promise<unknown>;
}

const tools: Tool[] = [
  {
    name: "get_slots",
    description: "Get information available of slots for bookings of studios, stylist and services.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
    implementation: () => Promise.resolve(getFreeSlots()),
  },
  {
    name: "get_users",
    description: "Get information of the users in the system that can book a slot.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
    implementation: () => Promise.resolve(getUsers()),
  },
  {
    name: "create_user",
    description: "Add a new user in the system to book available slots.",
    parameters: {
      type: "object",
      properties: {
        userName: {
          type: "string",
          description: "The name of the user.",
        },
      },
      required: ["userName"],
      additionalProperties: false,
    },
    implementation: (newUser: unknown) => {
      const userId = crypto.randomUUID();
      const user = { ...newUserSchema.parse(newUser), userId };

      createUser(user);

      return Promise.resolve({ userId, status: "User created!" });
    },
  },
  {
    name: "get_payment_token",
    description: "Get user payment information and returns a token that proves the user payed for the booking.",
    parameters: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "The id of the user.",
        },
        paymentCode: {
          type: "string",
          description: "Code provided by the user proving the payment was complete.",
        },
      },
      required: ["userId", "paymentCode"],
      additionalProperties: false,
    },
    implementation: (newPayment: unknown) => {
      const parsedPayment = newPaymentSchema.parse(newPayment);

      const paymentId = crypto.randomUUID();
      const paymentToken = crypto.randomUUID();
      const payment = { userId: parsedPayment.userId, paymentId, paymentToken };

      createPayment(payment);

      return Promise.resolve({ paymentToken, status: "Payment token created!" });
    },
  },
  {
    name: "create_booking",
    description: "Book a slot for a user, stylist and service.",
    parameters: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "The id of the user.",
        },
        slotId: {
          type: "string",
          description: "The id of the slot.",
        },
        serviceId: {
          type: "string",
          description: "The id of the service.",
        },
        paymentToken: {
          type: "string",
          description: "The payment token previous acquired proving the user paid for the booking.",
        },
      },
      required: ["userId", "slotId", "serviceId", "paymentToken"],
      additionalProperties: false,
    },
    implementation: (newBooking: unknown) => {
      const newBookingParsed = newBookingAISchema.parse(newBooking);
      const payment = getPaymentByPaymentToken(newBookingParsed.paymentToken);

      if (payment === null) {
        return Promise.resolve("Payment token not found. Get payment token from the user.");
      }

      const bookingId = crypto.randomUUID();
      const booking = {
        bookingId,
        userId: newBookingParsed.userId,
        slotId: newBookingParsed.slotId,
        serviceId: newBookingParsed.serviceId,
        paymentId: payment.paymentId,
      };

      createBooking(booking);

      return Promise.resolve({ status: "Booking created!" });
    },
  },
];

const inputTools = tools.map((tool) => {
  return {
    type: "function" as const,
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
    strict: true,
  };
});

const systemPrompt = `
You are a helpful AI voice agent designed to handle salon bookings. Your primary goal is to seamlessly book appointments based on user voice commands while ensuring no overbooking occurs and managing user identities correctly.

Here are your core instructions:

1.  **Real-time Availability Check:** When a user requests a booking, you MUST first scan the available time slots in real-time across all staff members and studios.
2.  **Prevent Overbooking:** You can ONLY create bookings for time slots that are currently empty (do not already have an associated booking). NEVER create a booking that would result in overbooking.
3.  **Understand Voice Commands:** You need to understand natural language voice commands to extract the following information:
    * Service type (e.g., "I want a haircut," "book me for coloring and a style").
    * Stylist preference (e.g., "with Sarah," "preferably by John"). If no stylist is specified, you can suggest available stylists.
    * Date and time preferences (e.g., "on Tuesday morning," "next Saturday at 3 PM," "sometime next week"). Be prepared to ask clarifying questions if the date and time are ambiguous.
4.  **User Identification:**
    * When a user provides their name for a booking, first check if a user with that exact name already exists in the system.
    * If a user with the same name exists, use their existing user ID for the new booking.
    * DO NOT create new user profiles if a user with the same name is already present.
5.  **Booking Confirmation:** When a booking is successfully made, ALWAYS respond to the user with the complete booking details, including:
    * Service booked.
    * Stylist name.
    * Date and time of the appointment.
    * Studio name (if applicable).
6.  **Payment Handling:** You will securely guide the user through the payment process. Do not directly ask for or store sensitive payment information within this interaction. Indicate that you are transferring them to a secure payment gateway or describe the next steps for payment.
7.  **Natural Conversation:** Maintain a natural and human-like conversation flow. Use polite and professional language.
8.  **Rescheduling and Cancellations:** Be prepared to handle requests for rescheduling or cancellations. Understand voice commands related to these actions and guide the user through the necessary steps.

Your primary focus is to make the booking process efficient and user-friendly through voice interaction, while strictly adhering to the rule of no overbooking and proper user identification.
`;

type Role = "user" | "assistant" | "system";

export const prompt = async (conversation: ConversationItem[]) => {
  const input = conversation.flatMap((conversationItem) => {
    if (conversationItem.response === undefined) {
      return [{ role: "user" as Role, content: conversationItem.query }];
    }

    return [
      { role: "user" as Role, content: conversationItem.query },
      { role: "assistant" as Role, content: conversationItem.response },
    ];
  });

  input.unshift({
    role: "system" as Role,
    content: systemPrompt,
  });

  let response = await openai.responses.create({ model, input, tools: inputTools });

  let hasFunctionCall = true;

  while (hasFunctionCall) {
    hasFunctionCall = false;

    for (const output of response.output) {
      if (output.type !== "function_call") {
        continue;
      }

      const tool = tools.find(({ name }) => name === output.name);

      if (tool === undefined) {
        continue;
      }

      const arg = JSON.parse(output.arguments);
      const result = await tool.implementation(arg);

      // @ts-expect-error
      input.push(output, {
        type: "function_call_output" as const,
        call_id: output.call_id,
        output: JSON.stringify(result),
      });

      response = await openai.responses.create({ model, input, tools: inputTools });

      hasFunctionCall = true;
    }
  }

  return response.output_text;
};

export const transcribe = async (file: File) => {
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "gpt-4o-mini-transcribe",
    response_format: "text",
  });

  return transcription;
};
