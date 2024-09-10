import * as sdk from 'node-appwrite';

const { NEXT_PUBLIC_ENDPOINT, PROJECT_ID, API_KEY, DATABASE_ID, PATIENT_COLLECTION_ID, APPOINTMENT_COLLECTION_ID, DOCTOR_COLLECTION_ID, NEXT_PUBLIC_BUCKET_ID } = process.env;

export const appwriteConfig = {
  endpoint: NEXT_PUBLIC_ENDPOINT,
  projectId: PROJECT_ID,
  apiKey: API_KEY,
  databaseId: DATABASE_ID,
  patientCollectionId: PATIENT_COLLECTION_ID,
  appointmentCollectionId: APPOINTMENT_COLLECTION_ID,
  doctorCollectionId: DOCTOR_COLLECTION_ID,
  storageId: NEXT_PUBLIC_BUCKET_ID
};

export const client = new sdk.Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setKey(appwriteConfig.apiKey!);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
