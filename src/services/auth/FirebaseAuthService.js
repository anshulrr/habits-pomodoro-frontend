import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updatePassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    AuthErrorCodes,
    signInWithPhoneNumber,
    RecaptchaVerifier
} from 'firebase/auth';

import { auth, provider } from "../firebaseConfig";
import { getAndStoreNotificationsToken } from "../FirebaseMessageService";

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



let appVerifier;

const signInWithPhone = async (phoneNumber, setShowOtpInput) => {

    console.log("initiated")

    window.recaptchaVerifier = await new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...
            console.log("reacaptch response", response)
            setShowOtpInput(true)
        },
        'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
        }
    });


    appVerifier = window.recaptchaVerifier;

    try {

        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log({ confirmationResult })
    }

    catch (error) {
        // Error; SMS not sent
        // ...
        console.log("SMS not sent", error);
    }
    return;
}
const verifyOtp = async (code) => {
    // const code = 654321; // User input
    try {
        const result = await window.confirmationResult.confirm(code);
        const user = result.user;
        console.log({ user });
        return user;
    } catch (error) {
        // User couldn't sign in (bad verification code?)
        console.error(error);
    }
}

const getRefreshedToken = async () => {
    return await auth.currentUser.getIdToken(/* forceRefresh */ true);
}

const subscribeToAuthChanges = async ({
    setFirebaseAuthLoaded,
    setAuthenticated,
    addInterceptors,
    setUser
}) => {
    console.log("subscribing to auth change")
    await onAuthStateChanged(auth, (user) => {
        console.debug('state changed', user);
        setFirebaseAuthLoaded(true);
        if (user !== null) {
            setAuthenticated(true);
            addInterceptors(user.accessToken);
            setUser({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
            });
            // set firebase notification to enabled
            // getAndStoreNotificationsToken(user.uid)
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
    signInWithPhone,
    verifyOtp
};

export default FirebaseAuthService;