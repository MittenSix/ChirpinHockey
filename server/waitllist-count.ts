import type { Handler } from '@netlify/functions';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! })
  .base(process.env.AIRTABLE_BASE_ID!);

export const handler: Handler = async () => {
  try {
    const records = await base('Waitlist').select({ fields: ['Email'] }).all();
    return { statusCode: 200, body: JSON.stringify({ count: records.length }) };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
