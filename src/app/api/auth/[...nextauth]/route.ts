import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                const userFound = await User.findOne({
                    email: credentials?.email,
                }).select("+password").populate('followers', 'eventReminders.event');

                if (!userFound) throw new Error("No se encontró el usuario");

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    userFound.password
                );

                if (!passwordMatch) throw new Error("La contraseña es incorrecta");
                return userFound;
            },
        }),
    ],
    callbacks: {
        jwt({ account, token, user, profile, session, trigger }) {
            console.log("callbacks.jwt: ", token.user);
            //siempre se llama al recargar pagina, primero esta
            if(trigger === 'update' && session?.user) {
                token.user = session?.user as any;
                //console.log("user updated session: ", session);
            }
            else if (user) token.user = user as any;
            return token;
        },
        session({ session, token }) {
            console.log("callbacks.session: ", token.user);
            //siempre se llama al recargar pagina
            session.user = token.user as any;
            return session;
        },
    },
    pages: {
        signIn: "/login",
        //signOut: "/logout"
    }
});

export { handler as GET, handler as POST }