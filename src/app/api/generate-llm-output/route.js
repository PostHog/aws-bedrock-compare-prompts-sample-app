import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { PostHog } from 'posthog-node'; // import PostHog

const client = new BedrockRuntimeClient({ region: "<YOUR_AWS_REGION>" }); // e.g. us-west-2


export async function POST(request) {
  const posthog = new PostHog(
    '<ph_project_api_key>',
    {
      host: '<ph_client_api_host>',
    },
  );  

  const { prompt, email, promptId } = await request.json();
  const modelId = "meta.llama3-8b-instruct-v1:0"
  try {
    const input = {
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt,
        max_gen_len: 512,
        temperature: 0.5,
        top_p: 0.9,
      }),
    };
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const rawRes = response.body;
    const jsonString = new TextDecoder().decode(rawRes);
    const parsedJSON = JSON.parse(jsonString);

    return new Response(jsonString, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate prompt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
  // Call posthog.shutdown() to flush and send all pending events before the serverless function shuts down.
  await posthog.shutdown();
  }
}