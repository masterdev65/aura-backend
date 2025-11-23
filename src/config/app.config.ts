export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api/v1',

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseUrl: process.env.FIREBASE_DATABASE_URL,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    depositAmount: parseInt(process.env.STRIPE_DEPOSIT_AMOUNT || '20', 10),
    depositType: process.env.STRIPE_DEPOSIT_TYPE || 'fixed',
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },

  googleCloud: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
  },

  whatsapp: {
    businessId: process.env.WHATSAPP_BUSINESS_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  },

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.FROM_EMAIL,
    fromName: process.env.FROM_NAME,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },

  salon: {
    name: process.env.SALON_NAME,
    address: process.env.SALON_ADDRESS,
    phone: process.env.SALON_PHONE,
    email: process.env.SALON_EMAIL,
    timezone: process.env.SALON_TIMEZONE || 'America/New_York',
  },

  urls: {
    frontend: process.env.FRONTEND_URL || 'http://localhost:4200',
    backend: process.env.BACKEND_URL || 'http://localhost:3000',
  },

  security: {
    rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },

  notifications: {
    reminder24hEnabled: process.env.REMINDER_24H_ENABLED === 'true',
    reminder2hEnabled: process.env.REMINDER_2H_ENABLED === 'true',
    smsEnabled: process.env.SMS_ENABLED === 'true',
    emailEnabled: process.env.EMAIL_ENABLED === 'true',
    whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
  },

  cancellationPolicy: {
    freeCancellationHours: parseInt(process.env.FREE_CANCELLATION_HOURS || '24', 10),
    lateCancellationFee: parseFloat(process.env.LATE_CANCELLATION_FEE || '50'),
    lateCancellationFeeType: process.env.LATE_CANCELLATION_FEE_TYPE || 'percentage',
    noShowFee: parseFloat(process.env.NO_SHOW_FEE || '100'),
    noShowFeeType: process.env.NO_SHOW_FEE_TYPE || 'percentage',
    maxNoShowsBeforePenalty: parseInt(process.env.MAX_NO_SHOWS_BEFORE_PENALTY || '2', 10),
  },

  loyalty: {
    enabled: process.env.LOYALTY_ENABLED === 'true',
    pointsPerDollar: parseFloat(process.env.LOYALTY_POINTS_PER_DOLLAR || '1'),
  },

  bufferTime: parseInt(process.env.BUFFER_TIME_MINUTES || '15', 10),
});
