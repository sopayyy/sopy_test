import dotenv from 'dotenv';

// global setup for playwright (not using cucumber)
async function globalSetup() {
  dotenv.config({
    override: true,
    path: 'src/config/env/.env',
  });
}

module.exports = globalSetup;
