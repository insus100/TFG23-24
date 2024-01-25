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
        fullname: formData.get("fullname"),
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
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div>{error}</div>}
        <h1>Registro</h1>
        <input type="text" placeholder="Nombre de usuario" name="username" />
        <input type="text" placeholder="email@ucm.es" name="email" />
        <input type="password" placeholder="" name="password" />
        <button>
          Register
        </button>
      </form>
    </div>
  )
}

export default RegisterPage