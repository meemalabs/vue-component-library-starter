import { TwilioSmsProvider } from '@novu/twilio';
import { ISendMessageSuccessResponse, ISmsOptions } from '@novu/stateless';
import { env } from '@stacksjs/utils' 

const provider = new TwilioSmsProvider({
  accountSid: env('TWILIO_ACCOUNT_SID', 'test'),
  authToken: env('TWILIO_AUTH_TOKEN', 'test'),
  from: env('TWILIO_FROM_NUMBER', 'test'),
});

async function send(options: ISmsOptions):Promise<ISendMessageSuccessResponse> {
  return await provider.sendMessage(options);
}

export { send as Send, send }