'use client';
import { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, Link } from "@nextui-org/react";
import addNotification from "react-push-notification-18";
function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {//esto es como hacer function handleSubmit(e: ...) {...}
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);//sacamos los datos de formulario
    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        //callbackUrl: 'http://localhost:3000/dashboard'
      });


      if (res?.ok){
        addNotification({
            title: 'Información',
            subtitle: undefined,
            message: 'Sesión iniciada correctamente',
            theme: 'darkblue',
            closeButton: 'X',
            native: false, 
        });
        return router.push("/dashboard");
      } 
      else return setError(res?.error as any)
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message)
      }

    }

  }
  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <form onSubmit={handleSubmit} className="bg-neutral-950 px-8 py-10 w-3/12">
        <h1 className="text-4xl font-bold mb-7" style={{ color: 'white' }}>Iniciar sesión</h1>


        <Input
          isRequired
          variant="bordered"
          type="email"
          label="Email"
          placeholder="Introduce tu e-mail"
          name="email"
          className="w-full"
          errorMessage={error}
          style={{ color: 'white' }}
        />

        <Input
          label="Contraseña"
          variant="bordered"
          placeholder="Introduce tu contraseña"
          type="password"
          name="password"
          className="w-full mt-4"
          style={{ color: 'white' }}
        />
        <Button color="primary" type="submit" className="w-full block mt-4">
          Iniciar sesión
        </Button>
        <Link href="/register" underline="hover" className="mt-2 block">¿No tienes cuenta? Regístrate</Link>
      </form>
    </div>
  )
}

export default LoginPage