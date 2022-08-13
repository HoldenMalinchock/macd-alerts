import { SMSRequest } from './types/message.ts';
import { serve } from "https://deno.land/std@0.142.0/http/server.ts";
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

serve((req: Request) => {
    const accountSid: string = <string>(
        Deno.env.get('TWILIO_ACCOUNT_SID')
       );
       const keySid: string = <string>(
        Deno.env.get('TWILIO_API_KEY')
       );
       const secret: string = <string>(
        Deno.env.get('TWILIO_API_SECRET')
       );
       const phoneNumber: string = <string>(
        Deno.env.get('TWILIO_PHONE_NUMBER')
       );
       const myPhone: string = <string>(
        Deno.env.get('TWILIO_MY_NUMBER')
       );

    const message: SMSRequest = {
        From: phoneNumber,
        To: myPhone,
        Body: 'Welcome to Twilio and Deno 🦕',
    };

    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization:  'Basic ' + base64.fromUint8Array(new TextEncoder().encode(keySID + ':' + secret));
        },
        body: new URLSearchParams(message).toString(),
    });



    new Response('Message Send!' + resp)
});