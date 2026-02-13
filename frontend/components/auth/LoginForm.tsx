"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Minimum 6 characters required")
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormData) => {

  const role = data.email.includes("official")
    ? "official"
    : "citizen"

  // Store session in localStorage
  localStorage.setItem("userRole", role)

  toast.success(`Logged in as ${role}`)

  setTimeout(() => {
    router.push("/dashboard")
  }, 1500)
}


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <Input placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Login
        </Button>

        <p className="text-center text-sm text-gray-300 hover:underline cursor-pointer">
          Forgot password?
        </p>

      </form>
    </div>
  )
}
