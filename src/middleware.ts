//export { default } from "next-auth/middleware";
import { getToken } from 'next-auth/jwt'
import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'
//https://stackoverflow.com/questions/77415447/nextjs-13-app-routes-protected-login-and-register-page-when-logged-in
// más cosas utiles https://stackoverflow.com/questions/74999200/how-to-wait-for-session-loading
export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    async function middleware(req) {
        const token = await getToken({ req })
        const isAuthenticated = !!token

        const authRoutes = ["/login", "/register"]

        if (authRoutes.includes(req.nextUrl.pathname) && isAuthenticated) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        if (!authRoutes.includes(req.nextUrl.pathname) && !isAuthenticated) {//si no esta logeado que y accede al dashboard que vaya al login
            return NextResponse.redirect(new URL('/login', req.url))
        }
    },
    {
        callbacks: {
            authorized: () => true,
        },
    }
)

export const config = {//rutas protegidas en las que se llamará al middleware
    matcher: ['/login', '/register', '/dashboard', '/profile']
    //para proteger todas las rutas dentro de una por ej, todas dentro de dashboard '/dashboard/:path*'
}
