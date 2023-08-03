import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updatePassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from 'firebase/auth';

const registerUser = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
    } catch (error) {
        throw error;
    }
};

const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const signOutUser = () => {
    return signOut(auth);
};

const changePassword = (password) => {
    return updatePassword(auth.currentUser, password);
};

const initiatePasswordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
};

const signInWithGoogle = () => {
    return signInWithPopup(auth, provider);
};

const subscribeToAuthChanges = ({ setFirebaseAuthLoaded, setAuthenticated, addInterceptors, setUsername }) => {
    onAuthStateChanged(auth, (user) => {
        // console.debug('state changed');
        setFirebaseAuthLoaded(true);
        if (user !== null) {
            setAuthenticated(true);
            addInterceptors(user.accessToken);
            setUsername(user.displayName);
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
    subscribeToAuthChanges,
};

export default FirebaseAuthService;