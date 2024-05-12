/*
 * This template contains a HTTP function that responds
 * with a greeting when called
 *
 * Reference PARAMETERS in your functions code with:
 * `process.env.<parameter-name>`
 * Learn more about building extensions in the docs:
 * https://firebase.google.com/docs/extensions/publishers
 */

import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import * as functions from "firebase-functions";


if (admin.apps.length === 0) {
  admin.initializeApp();
}



// exports.greetTheWorld = functions.https.onRequest(
//   (req: functions.Request, res: functions.Response) => {
//     // Here we reference a user-provided parameter
//     // (its value is provided by the user during installation)
//     const consumerProvidedGreeting = process.env.GREETING;

//     // And here we reference an auto-populated parameter
//     // (its value is provided by Firebase after installation)
//     const instanceId = process.env.EXT_INSTANCE_ID;

//     const greeting = `${consumerProvidedGreeting} World from ${instanceId}`;

//     res.send(greeting);
//   });





/**
 * User delete account
 *
 * This will delete user account from Firebase Auth, Realtime Database, Firestore.
 *
 */
export const deleteAccount = functions.https.onCall(async (data, context) => {

  console.log('version: 14');

  // Checking that the user is authenticated.
  if (!context.auth) {
    console.log("Throwing an HttpsError so that the client gets the error details.");
    throw new functions.https.HttpsError("failed-precondition", "The function must be " +
      "called while authenticated.", { code: "unauthenticated" });
  }

  const uid = context.auth?.uid;

  if (!uid) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError("invalid-argument", "The function must be called " +
      "with user \"uid\".");
  }
  // Delete user account
  const auth = getAuth();
  try {
    await auth.deleteUser(uid);
    return { code: 0, uid: uid };
  } catch (e: any) {
    console.log("deleteUser() failed. e:any -> ", e);
    if (e instanceof Error || (e as any).errorInfo?.code) {
      console.log("if (e instanceof Error || (e as any).errorInfo?.code) {");
      throw new functions.https.HttpsError("internal", (e as any).errorInfo.code + ": " + (e as any).errorInfo.message, { code: (e as any).errorInfo.code });
    } else {
      console.log('else { e.code, e.message. e', e.code, e.message, e);
      throw new functions.https.HttpsError("internal", 'deleteAccount() failed.', { code: (e as any).code, message: (e as any).message });
    }
  }
});


