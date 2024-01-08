import { getDoc, doc, setDoc, serverTimestamp, runTransaction } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const storeToken = async (uid, token) => {
    const deviceId = localStorage.getItem('deviceId');
    // console.log({ deviceId, uid })

    const deviceDocRef = doc(db, `users/${uid}/devices/`, deviceId);
    const deviceDocSnap = await getDoc(deviceDocRef);
    // console.log({ deviceDocSnap })

    if (!deviceDocSnap.exists()) {
        // console.log("adding new device doc");
        setDoc(deviceDocRef, { token, enabled: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    } else {
        // console.log("doc to be update:", deviceDocSnap.data());
        const deviceDoc = deviceDocSnap.data();
        if (deviceDoc.enabled && deviceDoc.token === token) {
            // nothing to update
            return;
        }
        try {
            await runTransaction(db, async (transaction) => {
                transaction.update(deviceDocRef, { enabled: true, updatedAt: serverTimestamp(), token });
            });
            // console.log("Enable Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
    }
}

export const disableToken = async (uid) => {
    const deviceId = localStorage.getItem('deviceId');
    // console.log({ uid, deviceId })

    const deviceDocRef = doc(db, `users/${uid}/devices/`, deviceId);

    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(deviceDocRef);
            if (!sfDoc.exists()) {
                // nothing to update
                // throw "Document does not exist!";
                return;
            }
            transaction.update(deviceDocRef, { enabled: false, updatedAt: serverTimestamp() });
        });
        // console.log("Disable Transaction successfully committed!");
    } catch (e) {
        console.log("Transaction failed: ", e);
    }
}