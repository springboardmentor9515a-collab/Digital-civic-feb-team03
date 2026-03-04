"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/api"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Minimum 6 characters required"),
  role: z.enum(["citizen", "official"]),
  location: z.string().min(2, "Location is required"),
})

type FormData = z.infer<typeof schema>

export default function RegisterForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await registerUser(data)

      localStorage.setItem("token", result.token)
      localStorage.setItem("userRole", result.user.role)
      localStorage.setItem("userName", result.user.name)
      localStorage.setItem("userLocation", result.user.location)
      localStorage.setItem("userId", result.user.id)

      toast.success(result.message || "Registration successful")

      if (result.user.role === "official") {
        router.push("/admin")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed"
      toast.error(message)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Full Name" {...register("name")} />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

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

        <div>
          <input type="hidden" {...register("role")} />
          <Select
            onValueChange={(value) =>
              setValue("role", value as "citizen" | "official", { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="citizen">Citizen</SelectItem>
              <SelectItem value="official">Official</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
        </div>

        <div>
          <Input placeholder="City / Town" {...register("location")} />
          {errors.location && (
            <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        <div>
          <Input type="file" />
          <p className="text-xs text-slate-400 mt-1">Optional: Upload ID verification</p>
        </div>

        <Button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>

      <p
        onClick={() => router.push("/login")}
        className="text-center text-sm text-gray-300 hover:underline cursor-pointer"
      >
        Already have an account? Login
      </p>
    </div>
  )
}
