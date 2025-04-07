# BookAI Salon

This is a draft project created to practice skills in AI and voice interface development. The project focuses on creating an AI-powered voice agent that allows users to book salon appointments through natural voice commands. Key features include real-time availability checking across multiple stylists and locations, understanding of service requests, and handling of scheduling preferences using a conversational voice interface designed to feel natural and responsive.

## Setup

- Install bun: https://bun.sh/docs/installation
- Run: `bun install`
- Run: `bun run init`

## Usage

- Development server: `bun dev`
- Production server: `bun start`

## Requirements

- Voice interface.
- Display slots across multiple staff members and branches/studios.
- Service type: haircut, coloring, styling.
- Date, time and stylist preferences.
- Payment details.
- Rescheduling.
- Cancellations.

## Domain model

![Domain model diagram](docs/domain.drawio.svg)

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

- Service type
- Customer
- Slot

Customer

- Name
- Payment details

## Stack

- [Bun](https://bun.sh/): Simple modern alternative for [Node.js](https://nodejs.org/). It comes with all the features that I need for this project, a web server with modern features that I can use for the frontend and API with routing and SQLite driver that I can use for the backend. It also comes with a test runner in case I need to write unit tests.

- [SQLite](https://sqlite.org/): Simple SQL database.

- [MCP Server](https://modelcontextprotocol.io/): Recent standard to allow agents to use tools and resources. In this case, manage bookings.

### Dev tooling

- [Prettier](https://prettier.io/): Code formatting.

- [Eslint](https://eslint.org/): Linting.

- [Sheriff](https://www.eslint-config-sheriff.dev/): Eslint configuration.

- [Husky](https://typicode.github.io/husky/): Commit hooks.
