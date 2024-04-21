'use client';
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, Link } from "@nextui-org/react";

function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {//esto es como hacer function handleSubmit(e: ...) {...}
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);//sacamos los datos del formulario
    try {
      const signupResponse = await axios.post("/api/auth/signup", {
        email: formData.get("email"),
        password: formData.get("password"),
        username: formData.get("username"),
      });
      console.log(signupResponse);
      const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.ok) return router.push("/dashboard");

    } catch (error) {
      console.log("RegisterPage", error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message)
      }

    }

  }
  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <form onSubmit={handleSubmit} className="bg-neutral-950 px-8 py-10 w-3/12">
        <h1 className="text-4xl font-bold mb-7" style={{ color: 'white' }}>Registrarse</h1>

        <Input
          isRequired
          variant="bordered"
          type="text"
          label="Nombre de usuario"
          placeholder="Introduce Nombre de usuario"
          name="username"
          className="w-full mb-2"
          errorMessage={error}
          style={{ color: 'white' }}
        />

        <Input
          isRequired
          variant="bordered"
          type="email"
          label="Correo electrónico"
          placeholder="Introduce correo electrónico"
          name="email"
          className="py-2 mb-2 w-full"
          style={{ color: 'white' }}
        />

        <Input
          label="Contraseña"
          variant="bordered"
          placeholder="Introduce tu contraseña"
          type="password"
          name="password"
          className="w-full"
          style={{ color: 'white' }}
        />

        <Button color="primary" type="submit" className="w-full block mt-4">
          Registrarse
        </Button>
        <Link href="/login" underline="hover" className="mt-2 block">¿Tienes cuenta? Inicia sesión</Link>
      </form>
    </div>
  )
}

export default RegisterPage