# Chain Webhook Demo

When BTC is sent to or from your address, this app will recieve a Webhook from Chain and send an SMS to your phone number.

This Node.js app uses the following services:

1. Chain.com
2. Twilio


## Setup
The easiest way to get started is to deploy the app to Heroku. This setup also assumes that you have a Chain.com & Twilio account.

Modify the `sample.env` file with your credentials.

```bash
$ git clone https://github.com/chain-engineering/webhooks-demo.git
$ cd webhooks-demo
$ heroku create
your-app.herokuapp.com
$ heroku config:set $(cat sample.env)
$ git push heroku master
$ curl https://your-app.herokuapp.com/setup
```
