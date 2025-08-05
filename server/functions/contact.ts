import type { Handler } from '@netlify/functions';
import Airtable from 'airtable';
import { contactFormSchema, type ContactForm } from '@shared/schema';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! })
  .base(process.env.AIRTABLE_BASE_ID!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data: ContactForm = contactFormSchema.parse(JSON.parse(event.body ?? '{}'));

    const [record] = await base('Contact').create([
      { fields: { Name: data.name, Email: data.email, Subject: data.subject, Message: data.message } }
    ]);

    return { statusCode: 200, body: JSON.stringify({ id: record.id }) };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 400, body: err.message };
  }
};
