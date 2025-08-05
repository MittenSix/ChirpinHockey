import Airtable from 'airtable';
import type { InsertWaitlistRegistration, ContactForm } from '@shared/schema';

export interface AirtableStorage {
  createWaitlistRegistration(data: InsertWaitlistRegistration): Promise<any>;
  createContactSubmission(data: ContactForm): Promise<any>;
  getWaitlistCount(): Promise<number>;
  getWaitlistRegistrationByEmail(email: string): Promise<any>;
}

export class AirtableService implements AirtableStorage {
  async createWaitlistRegistration(data: InsertWaitlistRegistration) {
    try {
      console.log('Attempting to create waitlist record in Airtable...');
      console.log('Base ID:', process.env.AIRTABLE_BASE_ID);
      console.log('Data:', data);
      
      const records = await base('Waitlist').create([
        {
          fields: {
            'Full Name': data.fullName,
            'Email': data.email,
          }
        }
      ]);
      console.log('Airtable waitlist creation success:', records[0].id);
      return {
        id: records[0].id,
        fullName: data.fullName,
        email: data.email,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Airtable waitlist creation error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async createContactSubmission(data: ContactForm) {
    try {
      console.log('Creating contact submission in Airtable:', data);
      console.log('Raw Base ID:', process.env.AIRTABLE_BASE_ID);
      console.log('Clean Base ID:', baseId);
      console.log('Token (first 10 chars):', process.env.AIRTABLE_API_KEY?.substring(0, 10));
      
      const records = await base('Contact').create([
        {
          fields: {
            'Name': data.name,
            'Email': data.email,
            'Subject': data.subject,
            'Message': data.message,
          }
        }
      ]);
      console.log('Airtable contact creation success:', records[0].id);
      return {
        id: records[0].id,
        ...data,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Airtable contact creation error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async getWaitlistCount(): Promise<number> {
    try {
      const records = await base('Waitlist').select({
        fields: ['Email'] // Just get count, don't need all data
      }).all();
      return records.length;
    } catch (error) {
      console.error('Airtable count error:', error);
      return 0;
    }
  }

  async getWaitlistRegistrationByEmail(email: string) {
    try {
      const records = await base('Waitlist').select({
        filterByFormula: `{Email} = "${email}"`,
        maxRecords: 1
      }).all();
      
      if (records.length === 0) {
        return undefined;
      }

      const record = records[0];
      return {
        id: record.id,
        fullName: record.fields['Full Name'],
        email: record.fields['Email'],
        createdAt: new Date(record.fields['Created At'] as string)
      };
    } catch (error) {
      console.error('Airtable email lookup error:', error);
      return undefined;
    }
  }
}

export const airtableService = new AirtableService();
