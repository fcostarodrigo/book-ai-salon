import { Database } from "bun:sqlite";

const db = new Database("database.sqlite", { create: true, strict: true });

const clearDatabase = () => {
  db.run("DROP TABLE IF EXISTS bookings");
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS slots");
  db.run("DROP TABLE IF EXISTS stylistServices");
  db.run("DROP TABLE IF EXISTS services");
  db.run("DROP TABLE IF EXISTS stylists");
  db.run("DROP TABLE IF EXISTS studios");
};

const createSchema = () => {
  db.run(`CREATE TABLE studios (
    studioId TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE stylists (
    stylistId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    studioId TEXT NOT NULL,
    FOREIGN KEY (studioId) REFERENCES studios(studioId)
  )`);

  db.run(`CREATE TABLE services (
    serviceId TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE stylistServices (
    stylistId TEXT NOT NULL,
    serviceId TEXT NOT NULL,
    PRIMARY KEY (stylistId, serviceId),
    FOREIGN KEY (stylistId) REFERENCES stylists(stylistId),
    FOREIGN KEY (serviceId) REFERENCES services(serviceId)
  )`);

  db.run(`CREATE TABLE slots (
    slotId TEXT PRIMARY KEY,
    stylistId TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    FOREIGN KEY (stylistId) REFERENCES stylists(stylistId)
  )`);

  db.run(`CREATE TABLE users (
    userId TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE bookings (
    bookingId TEXT PRIMARY KEY,
    slotId TEXT NOT NULL,
    userId TEXT NOT NULL,
    FOREIGN KEY (slotId) REFERENCES slots(slotId),
    FOREIGN KEY (userId) REFERENCES users(userId)
  )`);
};

const populateDatabase = () => {
  db.run(`INSERT INTO studios (studioId, name) VALUES 
    ('studio-1', 'Shear Bliss'),
    ('studio-2', 'The Strand Studio')
  `);

  db.run(`INSERT INTO stylists (stylistId, name, studioId) VALUES
    ('stylist-1', 'Ava Riley', 'studio-1'),
    ('stylist-2', 'Ethan Walker', 'studio-1'),
    ('stylist-3', 'Chloe Bennett', 'studio-2'),
    ('stylist-4', 'Liam Murphy', 'studio-2')
  `);

  db.run(`INSERT INTO services (serviceId, name) VALUES
    ('service-1', 'Haircut'),
    ('service-2', 'Coloring'),
    ('service-3', 'Highlight'),
    ('service-4', 'Styling')
  `);

  db.run(`INSERT INTO stylistServices (stylistId, serviceId) VALUES
    ('stylist-1', 'service-1'),
    ('stylist-1', 'service-2'),
    ('stylist-1', 'service-3'),
    ('stylist-1', 'service-4'),
    ('stylist-2', 'service-1'),
    ('stylist-3', 'service-1'),
    ('stylist-3', 'service-2'),
    ('stylist-3', 'service-3'),
    ('stylist-3', 'service-4'),
    ('stylist-4', 'service-1')
  `);

  db.run(`INSERT INTO slots (slotId, stylistId, startTime, endTime) VALUES
    ('slot-1', 'stylist-1', '2024-03-01T10:00:00', '2024-03-01T11:00:00'),
    ('slot-2', 'stylist-1', '2024-03-01T11:00:00', '2024-03-01T12:00:00'),
    ('slot-3', 'stylist-2', '2024-03-01T10:00:00', '2024-03-01T11:00:00'),
    ('slot-4', 'stylist-3', '2024-03-01T10:00:00', '2024-03-01T11:00:00'),
    ('slot-5', 'stylist-3', '2024-03-01T11:00:00', '2024-03-01T12:00:00'),
    ('slot-6', 'stylist-4', '2024-03-01T10:00:00', '2024-03-01T11:00:00')
  `);

  db.run(`INSERT INTO users (userId, name) VALUES
    ('user-1', 'John Doe'),
    ('user-2', 'Jane Smith')
  `);

  db.run(`INSERT INTO bookings (bookingId, slotId, userId) VALUES
    ('booking-1', 'slot-1', 'user-1'),
    ('booking-2', 'slot-3', 'user-2')
  `);
};

export const initDatabase = () => {
  clearDatabase();
  createSchema();
  populateDatabase();
};
