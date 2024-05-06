import { auth } from "@/app/firebase";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    pages: {
        signIn: '/signin'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials): Promise<any> {
                return await signInWithEmailAndPassword(auth, (credentials as any).email || '', (credentials as any).password || '')
                    .then(userCredential => {
                        if (userCredential.user) {
                            if(userCredential.user.emailVerified) {
                                return userCredential.user;
                            }
                            else {
                                sendEmailVerification(userCredential.user).then(() => {
                                    // Email sent
                                    console.log("Verification email sent.");
                                }).catch((error) => {
                                    // Handle errors here
                                    console.error("Error sending verification email:", error);
                                });
                                console.log('Email not verified');
                                return null;
                            }
                            
                        }
                        return null;
                    })
                    .catch(error => (console.log(error)))
            }
        })
    ],
}

export default NextAuth(authOptions)