import { SMSRequest } from './types/message.ts';
import { serve } from "https://deno.land/std@0.142.0/http/server.ts";
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";


export class TwilioSMS {
    public authorizationHeader: string;
  
    constructor(public accountSID: string, keySID: string, secret: string) {
        this.authorizationHeader = 'Basic ' + base64.fromUint8Array(new TextEncoder().encode(keySID + ':' + secret));
    }

    public postSMSRequest(payload: SMSRequest): Promise<string> {
        const request = fetch(
          'https://api.twilio.com/2010-04-01/Accounts/' +
            this.accountSID +
            '/Messages.json',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded;charset=UTF-8',
              Authorization: this.authorizationHeader,
            },
            body: new URLSearchParams(payload).toString(),
          }
        ).then((resp) => resp.json());
     
        const uri = request.then((resp) => {
          if (resp.status != 'queued') {
            return Promise.reject(resp.message);
          }
          return resp.uri;
        });
        return uri;
      }
     
 
}

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
       
    const helper = new TwilioSMS(accountSid, keySid, secret);
    helper.postSMSRequest(message)

    new Response('Message Send!')
});