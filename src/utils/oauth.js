import crypto from 'crypto-js';
import oauth1a from 'oauth-1.0a';

const GARMIN_CONSUMER_KEY='d194a60b-7df1-49d0-8e4c-40789ba1201a'
const GARMIN_CONSUMER_SECRET='HYHj6XfMzYCZIU3F6v4R2zAzYteQvLFC6VU'

export class Oauth1Helper {
  static getAuthHeaderForRequest(request, token, verifier) {
    const oauth = oauth1a({
      consumer: {key: GARMIN_CONSUMER_KEY, secret: GARMIN_CONSUMER_SECRET},
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.algo.HMAC.create(crypto.algo.SHA1, key)
          .update(base_string)
          .finalize()
          .toString(crypto.enc.Base64);
      },
    });

    const authorization = oauth.authorize(request, token, verifier);

    return oauth.toHeader(authorization);
  }
}