import type { Handler } from '@netlify/functions';
import Airtable from 'airtable';
import { contactFormSchema, type ContactForm } from '@shared/schema';

const baseId  = process.env.AIRTABLE_BASE_ID!;
const apiKey  = process.env.AIRTABLE_API_KEY!;
const base    = new Airtable({ apiKey }).base(baseId);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method Not Allowed' };

  const data = contactFormSchema.parse(JSON.parse(event.body || '{}')) as ContactForm;

  const [record] = await base('Contact').create([
    { fields: { Name: data.name, Email: data.email, Subject: data.subject, Message: data.message } }
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({ id: record.id })
  };
};
