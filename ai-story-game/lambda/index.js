const https = require('https');

exports.handler = async (event) => {
  if (event.requestContext.http.method === 'OPTIONS') {
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

  const body = JSON.parse(event.body);
  const userInput = body.input || "Start a new story.";

  const payload = JSON.stringify({
    model: "mistralai/mistral-7b-instruct", // or try `meta-llama/llama-3-8b-instruct`
    messages: [
      { role: "system", content: "You are a horror-action narrator in a post-apocalyptic wasteland of the game The last of us. (keep responses short). I am in position of elle, but ask me my name and use that throughout." },
      { role: "user", content: userInput }
    ]
  });

  const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
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

    req.write(payload);
    req.end();
  });
};


