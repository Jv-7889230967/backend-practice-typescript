import twilio from "twilio";

export const getTwilioClient = () => {
    const twillio_SID = process.env.TWILLIO_ACCOUNT_SID!;
    const twillio_Auth_TOKEN = process.env.TWILLIO_ACCOUNT_AUTH_TOKEN!;
    return twilio(twillio_SID, twillio_Auth_TOKEN);
};