import type { Handler } from '@netlify/functions';
export const handler: Handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({
    hasApiKey: !!process.env.AIRTABLE_API_KEY,
    hasBaseId: !!process.env.AIRTABLE_BASE_ID
  })
});
