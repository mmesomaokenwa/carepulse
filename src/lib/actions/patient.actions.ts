/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig, databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (data: CreateUserParams) => {
  try {
    const user = await users.create(ID.unique(), data.email, data.phone, undefined, data.name);

    return parseStringify(user);
  } catch (error: any) {
    if (error.code === 409) {
      const documents = await users.list([Query.equal('email', data.email)]);

      return parseStringify(documents.users[0]);
    }

    console.log({error: parseStringify(error)});
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(appwriteConfig.storageId!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.patientCollectionId!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.storageId}/files/${file.$id}/view??project=${appwriteConfig.projectId}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.patientCollectionId!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};