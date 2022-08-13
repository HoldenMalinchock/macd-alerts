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