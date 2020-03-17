module.exports = {
    ENV: process.env.NODE_EVN || "development",
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || "http://localhost:3000",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://admin1:UZoo9VFOF2nBsHNR@cluster0-iurxe.mongodb.net/test?retryWrites=true&w=majority"
}