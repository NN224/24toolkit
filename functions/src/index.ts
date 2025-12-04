import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Set maximum allowed instances
functions.runWith({ maxInstances: 10 });

export const setAdminRole = functions.https.onCall(async (data, context) => {
  const email = data.email;

  if (!email) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email is required."
    );
  }

  // TEMPORARY: allow setting admin without requiring an existing admin
  const user = await admin.auth().getUserByEmail(email);

  await admin.auth().setCustomUserClaims(user.uid, {
    admin: true,
  });

  return { message: `Admin role assigned to ${email}` };
});
