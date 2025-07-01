"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Ticket, Clock, CreditCard } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

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

export default function ExhibitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [loading, setLoading] = useState(true)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchExhibition()
    }
  }, [params.id])

  const fetchExhibition = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/exhibitions/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setExhibition(data.exhibition)
      } else {
        toast({
          title: "Error",
          description: "Exhibition not found",
          variant: "destructive",
        })
        router.push("/exhibitions")
      }
    } catch (error) {
      console.error("Error fetching exhibition:", error)
      toast({
        title: "Error",
        description: "Failed to load exhibition details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to purchase tickets",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!exhibition) return

    setPurchasing(true)

    try {
      const paymentData = {
        payment_id: `PAY_${Date.now()}_${user.id}`,
        user_id: user.id,
        exhibition_id: exhibition.id,
        tickets_to_buy: ticketQuantity,
        payment_method: "credit_card",
        total_amount: exhibition.ticket_price * ticketQuantity,
      }

      const response = await fetch("http://localhost:5000/api/payment/buy-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Purchase successful!",
          description: `You have successfully purchased ${ticketQuantity} ticket(s)`,
        })

        // Refresh exhibition data
        fetchExhibition()

        // Redirect to tickets page
        setTimeout(() => {
          router.push("/my-tickets")
        }, 2000)
      } else {
        toast({
          title: "Purchase failed",
          description: data.message || "Failed to purchase tickets",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase failed",
        description: "An error occurred during purchase",
        variant: "destructive",
      })
    } finally {
      setPurchasing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAvailableTickets = () => {
    if (!exhibition) return 0
    return exhibition.ticket_limit - (exhibition.ticket_sold || 0)
  }

  const getStatusBadge = () => {
    if (!exhibition) return null

    const now = new Date()
    const startDate = new Date(exhibition.start_date)
    const endDate = new Date(exhibition.end_date)
    const availableTickets = getAvailableTickets()

    if (availableTickets <= 0) {
      return <Badge variant="destructive">Sold Out</Badge>
    } else if (now < startDate) {
      return <Badge className="bg-blue-500">Upcoming</Badge>
    } else if (now >= startDate && now <= endDate) {
      return <Badge className="bg-green-500">Active</Badge>
    } else {
      return <Badge variant="secondary">Ended</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-lg p-8 animate-pulse">
              <div className="h-8 bg-slate-700 rounded mb-4"></div>
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-700 rounded mb-4"></div>
              <div className="h-32 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-400 text-lg">Exhibition not found</p>
        </div>
      </div>
    )
  }

  const availableTickets = getAvailableTickets()
  const maxTickets = Math.min(availableTickets, 10) // Limit to 10 tickets per purchase

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Exhibition Details */}
            <div className="lg:col-span-2">
              <Card className="glass border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-3xl text-white">{exhibition.name}</CardTitle>
                    {getStatusBadge()}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-slate-300">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
                      <div>
                        <p className="text-sm text-slate-400">Start Date</p>
                        <p>{formatDate(exhibition.start_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-purple-400" />
                      <div>
                        <p className="text-sm text-slate-400">End Date</p>
                        <p>{formatDate(exhibition.end_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-400" />
                      <div>
                        <p className="text-sm text-slate-400">Location</p>
                        <p>{exhibition.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-orange-400" />
                      <div>
                        <p className="text-sm text-slate-400">Available Tickets</p>
                        <p>
                          {availableTickets} / {exhibition.ticket_limit}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">About This Exhibition</h3>
                      <p className="text-slate-300 leading-relaxed">{exhibition.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Purchase Card */}
            <div className="lg:col-span-1">
              <Card className="glass border-slate-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Ticket className="h-5 w-5 mr-2 text-cyan-400" />
                    Purchase Tickets
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">${exhibition.ticket_price}</div>
                    <p className="text-slate-400">per ticket</p>
                  </div>

                  {availableTickets > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="quantity" className="text-slate-300">
                          Number of Tickets
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max={maxTickets}
                          value={ticketQuantity}
                          onChange={(e) =>
                            setTicketQuantity(Math.max(1, Math.min(maxTickets, Number.parseInt(e.target.value) || 1)))
                          }
                          className="bg-slate-800/50 border-slate-600 text-white mt-2"
                        />
                        <p className="text-xs text-slate-400 mt-1">Maximum {maxTickets} tickets per purchase</p>
                      </div>

                      <div className="border-t border-slate-700 pt-4">
                        <div className="flex justify-between text-slate-300 mb-2">
                          <span>Subtotal ({ticketQuantity} tickets)</span>
                          <span>${(exhibition.ticket_price * ticketQuantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-white font-semibold text-lg">
                          <span>Total</span>
                          <span>${(exhibition.ticket_price * ticketQuantity).toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handlePurchase}
                        disabled={purchasing || !user}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                      >
                        {purchasing ? (
                          "Processing..."
                        ) : !user ? (
                          "Login to Purchase"
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Purchase Tickets
                          </>
                        )}
                      </Button>

                      {!user && (
                        <p className="text-xs text-slate-400 text-center">
                          <Button
                            variant="link"
                            className="text-cyan-400 p-0 h-auto"
                            onClick={() => router.push("/auth/login")}
                          >
                            Sign in
                          </Button>{" "}
                          or{" "}
                          <Button
                            variant="link"
                            className="text-cyan-400 p-0 h-auto"
                            onClick={() => router.push("/auth/register")}
                          >
                            create an account
                          </Button>{" "}
                          to purchase tickets
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Badge variant="destructive" className="mb-4">
                        Sold Out
                      </Badge>
                      <p className="text-slate-400">This exhibition is currently sold out.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
