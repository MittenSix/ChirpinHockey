import type { Handler } from '@netlify/functions';
import Airtable from 'airtable';
import { insertWaitlistRegistrationSchema } from '@shared/schema';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! })
  .base(process.env.AIRTABLE_BASE_ID!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = insertWaitlistRegistrationSchema.parse(JSON.parse(event.body ?? '{}'));

    const [record] = await base('Waitlist').create([
      { fields: { 'Full Name': data.fullName, Email: data.email, Persona: data.persona } }
    ]);

    return { statusCode: 200, body: JSON.stringify({ id: record.id }) };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 400, body: err.message };
  }
};
