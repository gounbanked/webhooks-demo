var chain = require('chain-node');
var twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

chain.apiKeyId = process.env.CHAIN_KEY_ID;
chain.apiKeySecret = process.env.CHAIN_KEY_SECRET;

var txnDiff = function(col) {
  var col = _.filter(col, function(x) {
    return _.contains(x['addresses'], process.env.ADDRESS);
  });
  return _.reduce(col, function(memo, num) {return memo + num;}, 0);
}

var sendSMS = function(txn) {
  var b = 'sent=' + txnDiff(txn.outputs) +
      'received=' + txnDiff(txn.inputs);

  client.messages.create({
    body: b,
    to: process.env.YOUR_NUMBER,
    from: process.env.TWILIO_NUMBER
  }, function(err, message) {
    process.stdout.write(message.sid);
  });
}

var app = express();
app.use(bodyParser.json());

app.post('/', function (req, res) {
  if (req.body['event'] == 'address-transaction') {
    sendSMS(req.body.transaction);
    res.send('OK\n');
  }
  if (req.body['event'] == 'echo-verification') {
    res.send(req.body);
  }
});

app.get('/setup', function(req, res) {
  var appUrl = 'https://'+ req.headers.host;
  var eventOpts = {
    address: process.env.ADDRESS,
    block_chain: 'testnet3',
    event: 'address-transaction',
    confirmations: 0
  };

  console.log('Creating Chain Webhook for URL: ' + appUrl);
  chain.createWebhookUrl(appUrl, 'node-webhooks', function(err, resp) {
    if(err) {
      res.send('Error: ' + err);
      return;
    }
    chain.createWebhookEvent(resp.id, eventOpts, function(err, resp) {
      if(err) {
        res.send('Error: ' + err);
      } else {
        res.send('Webhook Event created. Id: ' + resp.id);
      }
    });
  });
});

app.listen(process.env.PORT || 4567);
