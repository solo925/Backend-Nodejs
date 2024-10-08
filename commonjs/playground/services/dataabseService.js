class DatabaseService {
    save(email, price, timestamp) {
        console.log(`Credentials saved to Databse: ${email} and ${price} and ${timestamp}`);

    }
}

module.exports = DatabaseService;