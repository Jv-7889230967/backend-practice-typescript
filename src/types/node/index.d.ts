namespace NodeJS {
    interface ProcessEnv {
        PORT:number;
        MONGO_CONNECTION_URI:string;
        JWT_ACCESS_TOKEN_SECRET:string;
        JWT_REFRESH_TOKEN_SECRET:string; 
        TWILLIO_ACCOUNT_SID:string;
        TWILLIO_ACCOUNT_AUTH_TOKEN:string;
        TWILLIO_PHONE_NUMBER:number;
    }
  }