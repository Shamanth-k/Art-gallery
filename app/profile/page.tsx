"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Calendar, Shield, Edit3, Save, X } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
    })
  }, [user, router])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just show a success message
      toast({
        title: "Profile Updated! ✨",
        description: "Your profile has been updated successfully.",
      })
      setEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    })
    setEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
                My Profile
              </h1>
              <p className="text-slate-300">Manage your account settings and preferences</p>
            </div>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-gradient-to-r from-pink-500 to-purple-500">
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 h-24 w-24 bg-pink-400/20 rounded-full blur-xl"></div>
                  </div>
                </div>
                <CardTitle className="text-white text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-slate-400 flex items-center justify-center mt-2">
                  <Shield className="h-4 w-4 mr-2 text-purple-400" />
                  {user.role === "admin" ? "Administrator" : "Member"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300 flex items-center">
                      <User className="h-4 w-4 mr-2 text-pink-400" />
                      Full Name
                    </Label>
                    {editing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    ) : (
                      <div className="p-3 bg-slate-800/30 rounded-md border border-slate-700">
                        <p className="text-white">{user.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-purple-400" />
                      Email Address
                    </Label>
                    {editing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    ) : (
                      <div className="p-3 bg-slate-800/30 rounded-md border border-slate-700">
                        <p className="text-white">{user.email}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-orange-400" />
                      Member Since
                    </Label>
                    <div className="p-3 bg-slate-800/30 rounded-md border border-slate-700">
                      <p className="text-white">
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-700">
                  {editing ? (
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-pink-500"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}

                  <Button
                    onClick={logout}
                    variant="outline"
                    className="bg-transparent border-red-600 text-red-400 hover:bg-red-600/10 hover:border-red-500"
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-pink-400 mb-1">0</div>
                  <div className="text-xs text-slate-400">Tickets Purchased</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
                  <div className="text-xs text-slate-400">Exhibitions Visited</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {user.role === "admin" ? "Admin" : "Member"}
                  </div>
                  <div className="text-xs text-slate-400">Account Type</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
