// netlify/functions/sendInvite.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { email, subject, text, html } = JSON.parse(event.body);

  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM;

  const url = `https://api.mailgun.net/v3/${domain}/messages`;
  const form = new URLSearchParams();
  form.append('from', from);
  form.append('to', email);
  form.append('subject', subject || 'Delululand Invite');
  if (text) form.append('text', text);
  if (html) form.append('html', html);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form.toString()
  });

  const data = await res.text();
  if (!res.ok) {
    return { statusCode: res.status, body: data };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, data })
  };
};
