'use client';
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";

function LoginPage() {
  const [error, setError] = useState();
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {//esto es como hacer function handleSubmit(e: ...) {...}
    e.preventDefault();

    const formData = new FormData(e.currentTarget);//sacar datos de formulario
    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        //callbackUrl: 'http://localhost:3000/dashboard'
      });


      //if (res?.error) return setError(res.error as string);

      if (res?.ok) return router.push("/dashboard");
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
        {error && <div className="bg-red-500 text-white p-2 mb-2">{error}</div>}
        <h1 className="text-4xl font-bold mb-7" style={{ color: 'white' }}>Iniciar sesión</h1>


        <Input
          isRequired
          variant="bordered"
          type="email"
          label="Email"
          placeholder="Introduce tu e-mail"
          name="email"
          className="w-full"
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
      </form>
    </div>
  )
}

export default LoginPage