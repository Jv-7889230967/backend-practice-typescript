import { ApiError } from "../utils/ApiError";
import { getTwilioClient } from "./TwilioClient";

export class SendMessage {
    phonenumber: number | undefined;
    payload: string | undefined;
    constructor(phonenumber: number, payload: string) {
        this.phonenumber = phonenumber;
        this.payload = payload;
    }

    sendMessage = async () => {
        const client = getTwilioClient();
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
