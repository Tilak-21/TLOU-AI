const https = require('https');
require('dotenv').config();


exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://d1u42gs4migrv6.cloudfront.net",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify({ message: "CORS preflight success" })
    };
  }

  let userInput = "Start a new story.";
  try {
    const body = JSON.parse(event.body);
    if (body?.input) userInput = body.input;
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON input." })
    };
  }

  const payload = JSON.stringify({
    model: "mistralai/mistral-7b-instruct",
    messages: [
      {
        role: "system",
        content: "You are a horror-action narrator in a post-apocalyptic wasteland like The Last of Us. I am playing as Ellie, a 14-year old. You are humorous, immersive, and fun. Respond narratively. Make it engaging and entertaining. Keep responses concise dont exceed 5 sentences per respons. Try to keep it concise."
      },
      {
        role: "user",
        content: userInput
      }
    ]
  });

  const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    method: 'POST',
    timeout: 15000, // 15 sec timeout
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log("Raw AI response:", data);
        try {
          const parsed = JSON.parse(data);
          const reply = parsed.choices?.[0]?.message?.content || '...';
          
          resolve({
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "https://d1u42gs4migrv6.cloudfront.net",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Methods": "POST,OPTIONS"
            },
            body: JSON.stringify({ response: reply })
          });
        } catch (err) {
          resolve({
            statusCode: 502,
            body: JSON.stringify({ error: "Failed to parse AI response." })
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: `Request failed: ${err.message}` })
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        statusCode: 504,
        body: JSON.stringify({ error: "Request timed out." })
      });
    });

    req.write(payload);
    req.end();
  });
};
