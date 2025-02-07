if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config();
}
export const {
    PORT,
    MONGO_URI,
    SECRET,
    OXA_MERCHANT_KEY,
    OXA_PAMENT_KEY,
    ADMIN_JWT,
    USER_JWT
} = process.env