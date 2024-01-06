import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updatePassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    AuthErrorCodes
} from 'firebase/auth';

import { auth, provider } from "../firebaseConfig";
import { getAndStoreToken } from "../FirebaseMessageService";

const registerUser = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        await signOut(auth);
    } catch (error) {
        // console.error(error);
        const errorCode = error.code;
        if (errorCode === AuthErrorCodes.WEAK_PASSWORD) {
            throw Error("Password should be at least 6 characters")
        } else if (errorCode === AuthErrorCodes.EMAIL_EXISTS) {
            throw Error("Email is already registered")
        } else {
            console.debug(error.code, error.message)
            // todo: don't show firebase error to user
            // let message = error.message;
            // message = message.slice(10);
            throw Error("Something went wrong")
        }
    }
};

const signInUser = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        // console.error(error);
        console.debug(error.code, error.message)
        throw Error("Something went wrong")
    }
};

const signOutUser = async () => {
    return await signOut(auth);
};

const changePassword = async (password) => {
    try {
        return await updatePassword(auth.currentUser, password);
    } catch (error) {
        // console.error(error);
        const errorCode = error.code;
        if (errorCode === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN) {
            throw Error("Please sign in again to change password");
        } else if (errorCode === AuthErrorCodes.WEAK_PASSWORD) {
            throw Error("Password should be at least 6 characters");
        } else {
            // todo: don't show firebase error to user
            console.debug(error.code, error.message);
            // let message = error.message;
            // message = message.slice(10);
            throw Error("Something went wrong");
        }
    }
};

const initiatePasswordResetEmail = async (email) => {
    return await sendPasswordResetEmail(auth, email);
};

const signInWithGoogle = async () => {
    try {
        return await signInWithPopup(auth, provider);
    } catch (error) {
        // console.error(error);
        console.debug(error.code, error.message);
        throw Error("Something went wrong");
    }
};

const getRefreshedToken = async () => {
    return await auth.currentUser.getIdToken(/* forceRefresh */ true);
}

const subscribeToAuthChanges = async ({
    setFirebaseAuthLoaded,
    setAuthenticated,
    addInterceptors,
    setUser
}) => {
    await onAuthStateChanged(auth, (user) => {
        // console.debug('state changed', user);
        setFirebaseAuthLoaded(true);
        if (user !== null && user.emailVerified) {
            setAuthenticated(true);
            addInterceptors(user.accessToken);
            setUser({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
            });
            // set firebase notification to enabled
            getAndStoreToken(user.uid)
        } else {
            setAuthenticated(false)
            setUser(null)
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
    subscribeToAuthChanges,
};

export default FirebaseAuthService;