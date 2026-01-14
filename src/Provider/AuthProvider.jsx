import { createContext, useEffect, useState } from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import app from "../firebase.config";
const auth = getAuth(app);
export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password).finally(() => {
            setLoading(false);
        });
    };

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password).finally(() => {
            setLoading(false);
        });
    };

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider).finally(() => {
            setLoading(false);
        });
    };

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        });
    };
    const refreshUser = () => {
        const currentUser = auth.currentUser;
        setUser({
            ...currentUser,
        });
    };

    const logOut = () => {
        setLoading(true);
        localStorage.removeItem('access-token');
        window.dispatchEvent(new Event('auth-token-updated'));
        return signOut(auth).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                localStorage.removeItem('access-token');
                window.dispatchEvent(new Event('auth-token-updated'));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        loginUser,
        googleLogin,
        logOut,
        updateUserProfile,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
