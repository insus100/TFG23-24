'use client';
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


function RegisterPage() {
  const [error, setError] = useState();
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {//esto es como hacer function handleSubmit(e: ...) {...}
    e.preventDefault();

    const formData = new FormData(e.currentTarget);//sacar datos de formulario
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

    } catch(error) {
      console.log("RegisterPage", error);
      if(error instanceof AxiosError) {
        setError(error.response?.data.message)
      }
      
    }
    
  }
  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <form onSubmit={handleSubmit} className="bg-neutral-950 px-8 py-10 w-3/12">
        {error && <div className="bg-red-500 text-white p-2 mb-2">{error}</div>}
        <h1 className="text-4xl font-bold mb-7" style={{ color: 'white' }}>Registrarse</h1>

        <label className="text-slate-300">Nombre de usuario:</label>
        <input
          type="text"
          placeholder="Nombre de usuario"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
          name="username"
        />

        <label className="text-slate-300">Correo electrónico:</label>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
          name="email"
        />

        <label className="text-slate-300">Contraseña:</label>
        <input
          type="password"
          placeholder="Contraseña"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
          name="password"
        />

        <button className="bg-blue-500 text-white px-4 py-2 block w-full mt-4">
          Registrarse
        </button>
      </form>
    </div>
  )
}

export default RegisterPage