import * as dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  jwt: {
    secret: process.env.JWT_SECRET
  },
  database: {
    mongo: {
      url: process.env.MONGO_URL
    }
  }
}