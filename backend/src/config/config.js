import { config } from 'dotenv';
config();
const _config = {
    port: process.env.PORT,
    frontend_domain: process.env.FRONTEND_DOMAIN,
    jwt_secret: process.env.JWT_SECRET,
    mongo_url: process.env.MONGO_CONNECTION_STRING,
}
export default _config;