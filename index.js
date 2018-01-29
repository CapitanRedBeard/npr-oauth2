'use strict';

const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const secrets = {
  id: 'nprone_trial_vwVllrzojK6v',
  secret: 'pFdh9SM2RO9hVDLX0c5dr6OZ5z9nKzCRhXKbBlS4',
  rootPath: 'https://api.npr.org',
  tokenPath: 'authorization/v2/token',
  authorizePath: 'authorization/v2/authorize',
}

const authorizationUri = {
  redirectRoot: encodeURI('http://localhost:3000/'),
  scope: 'localactivation',
  state: '123123',
}

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  //https://api.npr.org/authorization/v2/authorize?client_id=nprone_trial_vwVllrzojK6v&redirect_uri=https%3A%2F%2Fwww.getpostman.com%2Foauth2%2Fcallback&response_type=code&scope=localactivation&state=123123
  const requestUri = secrets.rootPath + '/' + secrets.authorizePath +
                      `?client_id=${secrets.id}` +
                      `&redirect_uri=${authorizationUri.redirectRoot}callback` +
                      '&response_type=code' +
                      `&scope=${authorizationUri.scope}` +
                      `&state=${authorizationUri.state}`

  console.log(requestUri);
  res.redirect(requestUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code;
  console.log("Code: ", code)

  if(code) {
    const form = new FormData();
    form.append('client_id', secrets.id);
    form.append('client_secret', secrets.secret);
    form.append('grant_type', 'authorization_code');
    form.append('code', code);
    form.append('redirect_uri', authorizationUri.redirectRoot + 'callback');

    fetch(secrets.rootPath + '/' + secrets.tokenPath,
    {
      method: "POST",
      body: form
    }).then(res => res.json()).then(json => {
      res.send(`Token is ${json.access_token}`)
    });
  }
  // res.redirect(requestUri);

  // request.post(requestUri);
  // oauth2.authorizationCode.getToken(options, (error, result) => {
  //   if (error) {
  //     console.error('Access Token Error', error.message);
  //     return res.json('Authentication failed');
  //   }
  //
  //   console.log('The resulting token: ', result);
  //   const token = oauth2.accessToken.create(result);
  //
  //   return res
  //     .status(200)
  //     .json(token);
  // });
});

app.get('/success', (req, res) => {
  res.send(`Token is ???`);
  // res.send(`Token is ${req.query.token}`);
});

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with NPR</a>');
});

app.listen(3000, () => {
  console.log('Express server started on port 3000'); // eslint-disable-line
});
