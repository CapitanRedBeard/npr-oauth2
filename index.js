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
  redirectRoot: 'https://protected-earth-11100.herokuapp.com/',
  scope: 'listening.readonly',
  state: '123',
}

let linkingUri = null

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  linkingUri = req.query.linkingUri;
  const requestUri = secrets.rootPath + '/' + secrets.authorizePath +
                      `?client_id=${secrets.id}` +
                      `&redirect_uri=${authorizationUri.redirectRoot}callback` +
                      '&response_type=code' +
                      `&scope=${authorizationUri.scope}` +
                      `&state=${authorizationUri.state}`
  res.redirect(requestUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code;
  const state = req.query.state;


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
      res.redirect(`${linkingUri}token=${json.access_token}`)
      linkingUri = null
    });
  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express server started on port 3000'); // eslint-disable-line
});
