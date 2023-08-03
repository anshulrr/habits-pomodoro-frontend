import { auth, provider } from "../firebaseConfig";
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updatePassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const registerUser = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

const signInUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

const signOutUser = async () => {
    return await signOut(auth);
};

const changePassword = async (password) => {
    return await updatePassword(auth.currentUser, password);
};

const initiatePasswordResetEmail = async (email) => {
    return await sendPasswordResetEmail(auth, email);
};

const signInWithGoogle = async () => {
    return await signInWithPopup(auth, provider);
};

const getRefreshedToken = async () => {
    return await auth.currentUser.getIdToken(/* forceRefresh */ true);
}

const getCurrentUserEmail = () => {
    return auth.currentUser.email;
}

const subscribeToAuthChanges = async ({
    setFirebaseAuthLoaded,
    setAuthenticated,
    addInterceptors,
    setUsername
}) => {
    await onAuthStateChanged(auth, (user) => {
        // console.debug('state changed');
        setFirebaseAuthLoaded(true);
        if (user !== null && user.emailVerified) {
            setAuthenticated(true);
            addInterceptors(user.accessToken);
            setUsername(user.displayName);
        } else {
            setAuthenticated(false)
            setUsername(null)
        }
    });
};

const FirebaseAuthService = {
    registerUser,
    signInUser,
    signOutUser,
    initiatePasswordResetEmail,
    changePassword,
    signInWithGoogle,
    getRefreshedToken,
    getCurrentUserEmail,
    subscribeToAuthChanges,
};

export default FirebaseAuthService;