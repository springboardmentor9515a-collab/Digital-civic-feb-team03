"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api"

const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Minimum 6 characters required"),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await loginUser(data)

      localStorage.setItem("token", result.token)
      localStorage.setItem("userRole", result.user.role)
      localStorage.setItem("userName", result.user.name)

      toast.success(result.message || `Logged in as ${result.user.role}`)

      if (result.user.role === "official") {
        router.push("/admin")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      toast.error(message)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Input type="password" placeholder="Password" {...register("password")} />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-sm text-gray-300 hover:underline cursor-pointer">
          Forgot password?
        </p>
      </form>
    </div>
  )
}
