import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {last} from "lodash";
import {AdminData} from "./model/admin";
import {assertIsDefined} from "./lib/assert";

admin.initializeApp();

const auth = admin.auth();
const db = admin.firestore();

export const onCreateAdminAuth = functions
    .region("asia-northeast1")
    .auth.user()
    .onCreate((user) => {
      const isSGUser = last(user.email?.split("@")) === "sonicgarden.jp";

      if (!isSGUser) {
        auth.deleteUser(user.uid);
        return;
      }

      assertIsDefined(user.email);
      const adminData: AdminData = {email: user.email};
      db.collection("admins").doc(user.uid).set(adminData);
      return;
    });
