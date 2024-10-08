const TicketManager = require('./ticketManager');
// import { ticketManager } from './ticketManager';
const EmailService = require('./emailService');
const DatabaseService = require('./databaseService');

const ticketManager = new TicketManager();
const emailService = new EmailService();
const databaseService = new DatabaseService();

ticketManager.on("buy", (email, price, timestamp) => {
    emailService.send(email)
    databaseService.save(email, price, timestamp)
})

ticketManager.buy("solomon@gmail.com", 30)
ticketManager.buy("solomon@gmail.com", 20)
ticketManager.buy("solomon@gmail.com", 10)
// ticketManager.buy("solomon@gmail.com")

