# BookAI Salon

This is a draft project created to practice skills in AI and voice interface development. The project focuses on creating an AI-powered voice agent that allows users to book salon appointments through natural voice commands. Key features include real-time availability checking across multiple stylists and locations, understanding of service requests, and handling of scheduling preferences using a conversational voice interface designed to feel natural and responsive.

## Requirements

- Voice interface.
- Display slots across multiple staff members and branches/studios.
- Service type: haircut, coloring, styling.
- Date, time and stylist preferences.
- Payment details.
- Rescheduling.
- Cancellations.

## Domain modal

![Domain modal diagram](docs/domain.drawio.svg)

Studio

- Name

Stylist

- Name
- Studio
- Service types

Slot

- Start and end
- Stylist

Booking

- Service types
- Customer
- Slot

Customer

- Name
- Payment details

## Stack

- [Bun](https://bun.sh/): Simple modern alternative for [Node.js](https://nodejs.org/). It comes with a web server with modern features that I can use for the frontend and routing and SQLite that I can use for the backend.

- [MCP Server](https://modelcontextprotocol.io/): Recent standard to allow agents to use tools and resources. In this case, manage bookings.
