const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const IBM_API_KEY = "APIKEY";
const IBM_URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
const PROJECT_ID = "PROJECTID";

async function getAccessToken() {
    const params = new URLSearchParams();
    params.append("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
    params.append("apikey", IBM_API_KEY);

    const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        body: params
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("IAM ERROR:", data);
        throw new Error("IAM authentication failed.");
    }

    return data.access_token;
}

async function generateForecast(neighborhood, medianPrice) {
    const token = await getAccessToken();

    const body = {
        input: `
You are an AI that forecasts home prices.

TASK:
Given a Detroit neighborhood and its current median price, predict the median price 5 years from now.

RULES:
- Output ONLY one integer dollar amount.
- No currency symbols.
- No decimals.
- No explanations.
- The value must usually be between 50000 and 500000.

Neighborhood: ${neighborhood}
Current Price: ${medianPrice}

Answer:
`,
        parameters: {
            decoding_method: "greedy",
            max_new_tokens: 20,
        },
        model_id: "ibm/granite-3-8b-instruct",
        project_id: PROJECT_ID
    };

    const res = await fetch(IBM_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    console.log("FORECAST RAW:", JSON.stringify(data, null, 2));

    const raw = data.results?.[0]?.generated_text || "";

    const match = raw.match(/\d+(\.\d+)?/);
    return match ? match[0] : "0";
}

module.exports = { generateForecast };
