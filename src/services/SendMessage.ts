import { ApiError } from "../utils/ApiError";
import twilio from "twilio";

export class SendMessage {
    phonenumber: number;
    payload: string;
    constructor(phonenumber: number, payload: string) {
        this.phonenumber = phonenumber;
        this.payload = payload;
    }

    sendMessage = async () => {
        const client = twilio("AC749ff3da530c00674ca8c992d54098c4", "93efc156cc9c0e5f49da00da39de77e9");
        try {
            await client.messages.create({
                body: this.payload,
                from: "+13153521337",
                to: `+91${this.phonenumber}`
            });
        } catch (error) {
            throw new ApiError("Failed to send OTP", 500);
        }
    }
}
