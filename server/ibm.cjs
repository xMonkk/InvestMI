const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const IBM_API_KEY = "APIKEY";

async function getAccessToken() {
    const url = "https://iam.cloud.ibm.com/identity/token";

    const params = new URLSearchParams();
    params.append("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
    params.append("apikey", IBM_API_KEY);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        body: params
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("IAM Error:", data);
        throw new Error("IBM IAM Token Error: " + JSON.stringify(data));
    }

    return data.access_token;
}

async function generateCrimeRate(neighborhood) {
    const accessToken = await getAccessToken();

    const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";

    const body = {
        input: `You are an AI system estimating Detroit neighborhood crime rate (0–100 scale).

STRICT INSTRUCTIONS:
- Output ONLY a number
- No words, text, %, labels, or explanation
- The number must vary realistically based on the neighborhood

Neighborhood: ${neighborhood}
Crime Rate:`,

        parameters: {
            decoding_method: "sample",   
            temperature: 0.4,            
            top_p: 0.9,
            max_new_tokens: 5
        },

        model_id: "meta-llama/llama-3-3-70b-instruct",  

        project_id: "PROJECT ID" 
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("IBM API ERROR:", data);
        throw new Error("IBM API Error: " + JSON.stringify(data));
    }

    const output = data.results?.[0]?.generated_text || "";

    const match = output.match(/\d+(\.\d+)?/);
    return match ? match[0] : "0";
}

async function generateChatAnswer(neighborhood, question) {
  const token = await getAccessToken();

  const body = {
    input: `You are an AI real-estate advisor. 
Answer questions about Detroit neighborhoods ONLY based on general investment logic.

Neighborhood: ${neighborhood}
User Question: ${question}

Respond professionally in 2–4 sentences.`,
    parameters: { max_new_tokens: 200 },
    model_id: "ibm/granite-3-8b-instruct",
    project_id: "28a44713-aaed-4f0c-bbcf-e2f22c95f922"
  };

  const res = await fetch("https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${token}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  return json.results?.[0]?.generated_text?.trim() || "AI had trouble answering.";
}

module.exports = { generateCrimeRate, generateChatAnswer };
