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
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const onSubmit = (data: FormData) => {

    // Store user session
    localStorage.setItem("userRole", data.role)

    toast.success("Registration successful!")

    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="space-y-6">

      <h2 className="text-3xl font-bold text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
        <div>
          <Input placeholder="Full Name" {...register("name")} />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Input placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <Input type="password" placeholder="Password" {...register("password")} />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role Selector */}
        <div>
          <Select onValueChange={(value) => setValue("role", value as "citizen" | "official")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="citizen">Citizen</SelectItem>
              <SelectItem value="official">Official</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-red-400 text-sm mt-1">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <Input placeholder="City / Town" {...register("location")} />
          {errors.location && (
            <p className="text-red-400 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* File Upload (Optional) */}
        <div>
          <Input type="file" />
          <p className="text-xs text-slate-400 mt-1">
            Optional: Upload ID verification
          </p>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Register
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
