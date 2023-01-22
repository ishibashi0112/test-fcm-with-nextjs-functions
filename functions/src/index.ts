import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const postCreateSnap = functions.firestore
  .document("posts/{postId}")
  .onCreate(async (snap) => {
    const postData = snap.data();
    const documentSnapShot = await admin
      .firestore()
      .collection("fcmTokens")
      .doc(postData.userId)
      .get();
    const fcmTokenData = documentSnapShot.data();
    const fcmToken = fcmTokenData ? (fcmTokenData.fcmToken as string) : "";

    admin
      .messaging()
      .send({
        token: fcmToken,
        notification: {
          title: postData.title,
          body: postData.body,
        },
      })
      .then((res) => {
        functions.logger.info(res);
      })
      .catch((err) => {
        functions.logger.info(err);
      });
  });
