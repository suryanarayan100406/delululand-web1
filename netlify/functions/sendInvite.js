exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const { email } = body;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    // Load Mailgun credentials from environment variables
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
    const MAILGUN_FROM = process.env.MAILGUN_FROM;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !MAILGUN_FROM) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Mailgun environment variables not configured",
        }),
      };
    }

    // Prepare Mailgun API request
    const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

    const formData = new URLSearchParams();
    formData.append("from", MAILGUN_FROM);
    formData.append("to", email);
    formData.append("subject", "Welcome to Delululand 🚀");
    formData.append(
      "text",
      `Hey 👋

Welcome to Delululand!

You’ve been invited to try GenZChat — fast, fun, anonymous, and AI-powered.

We’re just getting started 🌈
Stay tuned.

— Delululand Team`
    );

    // Send email using built-in fetch (Node 18)
    const response = await fetch(mailgunUrl, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Mailgun request failed",
          details: errorText,
        }),
      };
    }

    // Success
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        message: "Invite email sent successfully",
        email,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected server error",
        details: error.message,
      }),
    };
  }
};
