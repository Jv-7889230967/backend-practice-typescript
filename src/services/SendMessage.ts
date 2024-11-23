import { ApiError } from "../utils/ApiError";
import twilio from "twilio";

export class SendMessage {
    phonenumber: number | undefined;
    payload: string | undefined;
    constructor(phonenumber: number, payload: string) {
        this.phonenumber = phonenumber;
        this.payload = payload;
    }

    sendMessage = async () => {
        const twillio_SID: string = process.env.TWILLIO_ACCOUNT_SID;
        const twillio_Auth_TOKEN: string = process.env.TWILLIO_ACCOUNT_AUTH_TOKEN;
        const client = twilio(twillio_SID, twillio_Auth_TOKEN);
        try {
            await client.messages.create({
                body: this.payload,
                from: process.env.TWILLIO_PHONE_NUMBER,
                to: `+91${this.phonenumber}`
            });
        } catch (error) {
            throw new ApiError("Failed to send OTP", 500);
        }
    }
}
