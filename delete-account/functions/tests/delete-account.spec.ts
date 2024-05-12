import * as admin from "firebase-admin";
import * as test from "firebase-functions-test";
import { deleteAccount } from "../src/index";

import * as assert from "assert";




if (admin.apps.length === 0) {
    admin.initializeApp();
}


/**
* This test is not reliable because the tokens may be invalid after a while.
*/
describe("Delete account)", () => {
    it("Not login error", async () => {
        const wrapped = test().wrap(deleteAccount);
        try {
            await wrapped({});
        } catch (e) {
            assert.equal((e as any).details.code, "unauthenticated", "User not logged in");
        }
    });

    it("Test with invalid uid", async () => {
        const wrapped = test().wrap(deleteAccount);
        try {
            await wrapped({}, {
                auth: {
                    uid: 'this-is-invalid-uid',
                },
            });
        } catch (e) {
            assert.equal((e as any).details.code, "auth/user-not-found", "User not found");
        }
    });

    it("Test with valid uid", async () => {
        // Create user to test
        const user = await admin.auth().createUser({
            email: 'time' + (new Date).getTime() + '@gmail.com',
            password: '@Pw,u~' + (new Date).getTime(),
        });

        const wrapped = test().wrap(deleteAccount);

        const re = await wrapped({}, {
            auth: {
                uid: user.uid,
            },
        });

        assert.equal(re.code, 0, "User deleted");
    });

    it("Test with valid uid and delete again with the same uid", async () => {
        // Create user to test
        const user = await admin.auth().createUser({
            email: 'time-2-' + (new Date).getTime() + '@gmail.com',
            password: '@Pw,u~' + (new Date).getTime(),
        });

        const wrapped = test().wrap(deleteAccount);

        await wrapped({}, {
            auth: {
                uid: user.uid,
            },
        });

        try {
            await wrapped({}, {
                auth: {
                    uid: user.uid,
                },
            });
        }
        catch (e) {
            assert.equal((e as any).details.code, "auth/user-not-found", "User not found");
        }


    }).timeout(10000);
});

