import {Log} from 'models';
import Razorpay from 'razorpay';
import {RAZOR_PAY_CREDS} from 'loaders/config';

let razorPayClient;

const TAG = 'loader.razor_pay';

export function razorPayClientLoader() {
    try {
        if (razorPayClient) {
            return razorPayClient;
        }
        razorPayClient = new Razorpay({
            key_id: RAZOR_PAY_CREDS.API_KEY || "rzp_test_CkTcdYrM3W9JWD",
            key_secret: RAZOR_PAY_CREDS.API_KEY_SECRET || 'uk8MvkFaMQ8TjcaX6JjcMYFI',
        });
        return razorPayClient;
    } catch (error) {
        Log.error(TAG, 'fetchRazorPayClient()', error);
        throw error;
    }
}
