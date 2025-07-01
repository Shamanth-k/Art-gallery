"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Palette,
  Calendar,
  Trash2,
  DollarSign,
  Ticket,
  Users,
  TrendingUp,
  Eye,
  Download,
  BarChart3,
  Activity,
  UserCheck,
  CreditCard,
  MapPin,
  Clock,
} from "lucide-react"
import { motion } from "framer-motion"
import { AddArtistDialog } from "@/components/admin/add-artist-dialog"
import { AddExhibitionDialog } from "@/components/admin/add-exhibition-dialog"

interface Artist {
  id: number
  name: string
  country: string
  biography: string
  date_of_birth: string
  date_of_death: string | null
  art_piece: string
}

interface Exhibition {
  id: number
  name: string
  start_date: string
  end_date: string
  location: string
  ticket_price: number
  ticket_limit: number
  ticket_sold: number
  description: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

interface TicketSale {
  id: number
  user_name: string
  user_email: string
  exhibition_name: string
  tickets_purchased: number
  total_amount: number
  purchase_date: string
  payment_method: string
  status: string
}

interface DashboardStats {
  totalUsers: number
  totalArtists: number
  totalExhibitions: number
  totalRevenue: number
  totalTicketsSold: number
  activeExhibitions: number
  pendingPayments: number
  avgTicketPrice: number
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [artists, setArtists] = useState<Artist[]>([])
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [ticketSales, setTicketSales] = useState<TicketSale[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArtists: 0,
    totalExhibitions: 0,
    totalRevenue: 0,
    totalTicketsSold: 0,
    activeExhibitions: 0,
    pendingPayments: 0,
    avgTicketPrice: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    fetchAllData()
  }, [user, router])

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      // Fetch all data in parallel
      const [artistsRes, exhibitionsRes, usersRes, ticketsRes] = await Promise.all([
        fetch("http://localhost:5000/api/artists", { headers }),
        fetch("http://localhost:5000/api/exhibitions", { headers }),
        fetch("http://localhost:5000/api/admin/users", { headers }).catch(() => ({ ok: false })),
        fetch("http://localhost:5000/api/admin/ticket-sales", { headers }).catch(() => ({ ok: false })),
      ])

      const artistsData = await artistsRes.json()
      const exhibitionsData = await exhibitionsRes.json()

      setArtists(artistsData || [])
      setExhibitions(exhibitionsData.exhibitions || [])

      // Mock users data if API doesn't exist
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])
      } else {
        // Mock users data
        setUsers([
          { id: 1, name: "John Doe", email: "john@example.com", role: "user", created_at: "2024-01-15" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", created_at: "2024-01-20" },
          { id: 3, name: "Admin User", email: "admin@futuregallery.com", role: "admin", created_at: "2024-01-01" },
        ])
      }

      // Mock ticket sales data if API doesn't exist
      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json()
        setTicketSales(ticketsData.sales || [])
      } else {
        // Generate mock ticket sales data
        const mockSales = generateMockTicketSales(exhibitionsData.exhibitions || [])
        setTicketSales(mockSales)
      }

      // Calculate stats
      calculateStats(exhibitionsData.exhibitions || [], users, ticketSales)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateMockTicketSales = (exhibitions: Exhibition[]): TicketSale[] => {
    const mockSales: TicketSale[] = []
    const users = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Wilson", "Carol Brown"]
    const emails = ["john@example.com", "jane@example.com", "alice@example.com", "bob@example.com", "carol@example.com"]
    const paymentMethods = ["credit_card", "paypal", "stripe"]

    exhibitions.forEach((exhibition, index) => {
      const salesCount = Math.min(exhibition.ticket_sold || 0, 10) // Limit mock data
      for (let i = 0; i < salesCount; i++) {
        const userIndex = Math.floor(Math.random() * users.length)
        const ticketCount = Math.floor(Math.random() * 3) + 1
        mockSales.push({
          id: mockSales.length + 1,
          user_name: users[userIndex],
          user_email: emails[userIndex],
          exhibition_name: exhibition.name,
          tickets_purchased: ticketCount,
          total_amount: ticketCount * exhibition.ticket_price,
          purchase_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          status: Math.random() > 0.1 ? "completed" : "pending",
        })
      }
    })

    return mockSales
  }

  const calculateStats = (exhibitions: Exhibition[], users: User[], sales: TicketSale[]) => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0)
    const totalTicketsSold = sales.reduce((sum, sale) => sum + sale.tickets_purchased, 0)
    const activeExhibitions = exhibitions.filter((ex) => {
      const now = new Date()
      const start = new Date(ex.start_date)
      const end = new Date(ex.end_date)
      return now >= start && now <= end
    }).length
    const pendingPayments = sales.filter((sale) => sale.status === "pending").length
    const avgTicketPrice =
      exhibitions.length > 0 ? exhibitions.reduce((sum, ex) => sum + ex.ticket_price, 0) / exhibitions.length : 0

    setStats({
      totalUsers: users.length,
      totalArtists: artists.length,
      totalExhibitions: exhibitions.length,
      totalRevenue,
      totalTicketsSold,
      activeExhibitions,
      pendingPayments,
      avgTicketPrice,
    })
  }

  const deleteArtist = async (id: number) => {
    if (!confirm("Are you sure you want to delete this artist?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/artists/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Artist deleted successfully",
        })
        fetchAllData()
      } else {
        throw new Error("Failed to delete artist")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete artist",
        variant: "destructive",
      })
    }
  }

  const deleteExhibition = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exhibition?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/exhibitions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Exhibition deleted successfully",
        })
        fetchAllData()
      } else {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete exhibition")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete exhibition",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const exportData = (data: any[], filename: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful! 📊",
      description: `${filename} has been downloaded`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded w-1/4"></div>
            <div className="grid md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
                Admin Dashboard 📊
              </h1>
              <p className="text-slate-300">Comprehensive gallery management and analytics</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => exportData(ticketSales, "ticket-sales")}
                variant="outline"
                className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
              >
                📊 Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
              >
                👥 Users
              </TabsTrigger>
              <TabsTrigger
                value="sales"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
              >
                🎫 Sales
              </TabsTrigger>
              <TabsTrigger
                value="artists"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
              >
                🎨 Artists
              </TabsTrigger>
              <TabsTrigger
                value="exhibitions"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
              >
                🖼️ Exhibitions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</div>
                    <p className="text-xs text-slate-400">💰 Total earnings</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Tickets Sold</CardTitle>
                    <Ticket className="h-4 w-4 text-orange-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalTicketsSold}</div>
                    <p className="text-xs text-slate-400">🎫 Total tickets</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                    <p className="text-xs text-slate-400">👥 Registered users</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Active Shows</CardTitle>
                    <Activity className="h-4 w-4 text-pink-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.activeExhibitions}</div>
                    <p className="text-xs text-slate-400">🎭 Currently running</p>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-5 w-5 text-pink-400" />
                      <div>
                        <div className="text-lg font-bold text-white">{stats.totalArtists}</div>
                        <div className="text-xs text-slate-400">Featured Artists</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      <div>
                        <div className="text-lg font-bold text-white">{stats.totalExhibitions}</div>
                        <div className="text-xs text-slate-400">Total Exhibitions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-orange-400" />
                      <div>
                        <div className="text-lg font-bold text-white">{stats.pendingPayments}</div>
                        <div className="text-xs text-slate-400">Pending Payments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      <div>
                        <div className="text-lg font-bold text-white">{formatCurrency(stats.avgTicketPrice)}</div>
                        <div className="text-xs text-slate-400">Avg Ticket Price</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Top Performers */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-pink-400" />
                      Recent Ticket Sales 🎫
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ticketSales.slice(0, 5).map((sale) => (
                        <div key={sale.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{sale.user_name}</p>
                            <p className="text-slate-400 text-sm">{sale.exhibition_name}</p>
                            <p className="text-xs text-slate-500">{formatDate(sale.purchase_date)}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 mb-1">
                              {formatCurrency(sale.total_amount)}
                            </Badge>
                            <p className="text-xs text-slate-400">{sale.tickets_purchased} tickets</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-purple-400" />
                      Top Performing Exhibitions 🏆
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {exhibitions
                        .sort((a, b) => (b.ticket_sold || 0) - (a.ticket_sold || 0))
                        .slice(0, 5)
                        .map((exhibition) => (
                          <div
                            key={exhibition.id}
                            className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg"
                          >
                            <div>
                              <p className="text-white font-medium">{exhibition.name}</p>
                              <p className="text-slate-400 text-sm">{exhibition.location}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">
                                {exhibition.ticket_sold || 0}/{exhibition.ticket_limit}
                              </div>
                              <div className="w-20 bg-slate-600 rounded-full h-2 mt-1">
                                <div
                                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                                  style={{
                                    width: `${((exhibition.ticket_sold || 0) / exhibition.ticket_limit) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">User Management 👥</h2>
                <Button
                  onClick={() => exportData(users, "users")}
                  variant="outline"
                  className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
              </div>

              <div className="grid gap-4">
                {users.map((user) => (
                  <Card key={user.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{user.name}</h3>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                            <p className="text-xs text-slate-500">Joined: {formatDate(user.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              user.role === "admin" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-600"
                            }
                          >
                            {user.role === "admin" ? "👑 Admin" : "👤 User"}
                          </Badge>
                          <p className="text-xs text-slate-400 mt-1">
                            {ticketSales.filter((sale) => sale.user_email === user.email).length} purchases
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Ticket Sales Analytics 🎫</h2>
                <Button
                  onClick={() => exportData(ticketSales, "ticket-sales")}
                  variant="outline"
                  className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Sales
                </Button>
              </div>

              {/* Sales Summary Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{formatCurrency(stats.totalRevenue)}</div>
                    <div className="text-slate-300">Total Revenue 💰</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">{stats.totalTicketsSold}</div>
                    <div className="text-slate-300">Tickets Sold 🎫</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{ticketSales.length}</div>
                    <div className="text-slate-300">Total Transactions 📊</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Sales List */}
              <div className="grid gap-4">
                {ticketSales.map((sale) => (
                  <Card key={sale.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-center">
                        <div>
                          <h3 className="text-white font-semibold">{sale.user_name}</h3>
                          <p className="text-slate-400 text-sm">{sale.user_email}</p>
                        </div>
                        <div>
                          <p className="text-white font-medium">{sale.exhibition_name}</p>
                          <p className="text-slate-400 text-sm">{sale.tickets_purchased} tickets</p>
                        </div>
                        <div>
                          <p className="text-white font-bold">{formatCurrency(sale.total_amount)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <CreditCard className="h-3 w-3 text-slate-400" />
                            <p className="text-slate-400 text-xs capitalize">{sale.payment_method.replace("_", " ")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={sale.status === "completed" ? "bg-green-500" : "bg-yellow-500"}>
                            {sale.status === "completed" ? "✅ Completed" : "⏳ Pending"}
                          </Badge>
                          <p className="text-slate-400 text-xs mt-1">{formatDate(sale.purchase_date)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="artists" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Artist Management 🎨</h2>
                <AddArtistDialog onSuccess={fetchAllData} />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <Card
                    key={artist.id}
                    className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{artist.name}</CardTitle>
                          <CardDescription className="text-slate-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {artist.country}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteArtist(artist.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm mb-3 line-clamp-3">{artist.biography}</p>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>Born: {formatDate(artist.date_of_birth)}</span>
                        {artist.art_piece && (
                          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">🎨 {artist.art_piece}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="exhibitions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Exhibition Management 🖼️</h2>
                <AddExhibitionDialog onSuccess={fetchAllData} />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exhibitions.map((exhibition) => (
                  <Card
                    key={exhibition.id}
                    className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{exhibition.name}</CardTitle>
                          <CardDescription className="text-slate-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {exhibition.location}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExhibition(exhibition.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-slate-300 text-sm line-clamp-2">{exhibition.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div>
                          <span className="text-pink-400">Start:</span> {formatDate(exhibition.start_date)}
                        </div>
                        <div>
                          <span className="text-purple-400">End:</span> {formatDate(exhibition.end_date)}
                        </div>
                        <div>
                          <span className="text-green-400">Price:</span> {formatCurrency(exhibition.ticket_price)}
                        </div>
                        <div>
                          <span className="text-orange-400">Sold:</span> {exhibition.ticket_sold || 0}/
                          {exhibition.ticket_limit}
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Sales Progress</span>
                          <span>{Math.round(((exhibition.ticket_sold || 0) / exhibition.ticket_limit) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${((exhibition.ticket_sold || 0) / exhibition.ticket_limit) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-2 text-center">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                          💰 {formatCurrency((exhibition.ticket_sold || 0) * exhibition.ticket_price)} Revenue
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
