//export { default } from "next-auth/middleware";
import { getToken } from 'next-auth/jwt'
import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'
//https://stackoverflow.com/questions/77415447/nextjs-13-app-routes-protected-login-and-register-page-when-logged-in
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

export const config = {//rutas protegidas a las que no se puede acceder sin haberse logueado
    matcher: ['/login', '/register', '/dashboard']
    //para proteger todas las rutas dentro de una por ej, todas dentro de dashboard '/dashboard/:path*'
}
