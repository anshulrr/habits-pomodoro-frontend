import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const storeToken = async (userId, token) => {
    const docSnap = await getDoc(doc(db, 'userTokens', userId));
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());

        const { tokens } = docSnap.data();
        for (const t of tokens) {
            if (t === token) {
                console.log('token already added')
                return;
            }
        }
        tokens.push(token)
        setDoc(doc(db, 'userTokens', userId), { tokens });
        // TODO: delete token when logging out

    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        setDoc(doc(db, 'userTokens', userId), { tokens: [token] });
    }
}