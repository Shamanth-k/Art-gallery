"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Ticket, CreditCard, Download, RefreshCw, MapPin, DollarSign, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface TicketData {
  id: number
  exhibition_id: number
  tickets_purchased: number
  purchase_date: string
  exhibition_name: string
  location: string
  start_date: string
  end_date: string
  ticket_price: number
  payment_id: string
  status: string
  payment_method: string
  total_amount: number
  payment_date: string
}

export default function MyTicketsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    fetchTickets()
  }, [user, router])

  const fetchTickets = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/tickets?user_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setTickets(data.tickets || [])
      } else {
        if (response.status !== 404) {
          throw new Error(data.message || "Failed to fetch tickets")
        }
        setTickets([])
      }
    } catch (error: any) {
      console.error("Error fetching tickets:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load your tickets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="status-active">✓ Confirmed</Badge>
      case "pending":
        return <Badge className="status-pending">⏳ Pending</Badge>
      case "failed":
        return <Badge className="status-sold-out">✗ Failed</Badge>
      default:
        return <Badge className="status-active">✓ Confirmed</Badge>
    }
  }

  const getExhibitionStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) {
      return <Badge className="bg-zinc-600">📅 Upcoming</Badge>
    } else if (now >= start && now <= end) {
      return <Badge className="status-active">🎭 Active</Badge>
    } else {
      return <Badge className="status-ended">📋 Ended</Badge>
    }
  }

  const downloadTicket = (ticket: TicketData) => {
    const ticketContent = `
🎨 FUTURE GALLERY - DIGITAL TICKET 🎨
=====================================

Exhibition: ${ticket.exhibition_name}
Location: ${ticket.location}
Tickets: ${ticket.tickets_purchased}
Purchase Date: ${formatDate(ticket.purchase_date)}
Exhibition Dates: ${formatShortDate(ticket.start_date)} - ${formatShortDate(ticket.end_date)}
Payment ID: ${ticket.payment_id}
Total Amount: $${ticket.total_amount?.toFixed(2) || (ticket.tickets_purchased * ticket.ticket_price).toFixed(2)}
Status: ${ticket.status || "Confirmed"}

Thank you for visiting Future Gallery!
Enjoy your digital art experience! ✨

This is your official ticket. Please present this
when attending the exhibition.
    `

    const blob = new Blob([ticketContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `future-gallery-ticket-${ticket.payment_id || ticket.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Ticket Downloaded! 🎫",
      description: "Your ticket has been downloaded successfully",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-zinc-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">My Tickets</h1>
              <p className="text-zinc-400">View and manage your exhibition tickets</p>
            </div>
            <Button onClick={fetchTickets} variant="outline" className="btn-modern bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {tickets.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto glass rounded-full flex items-center justify-center border border-zinc-700">
                  <Ticket className="h-16 w-16 text-zinc-400" />
                </div>
                <div className="absolute inset-0 w-32 h-32 mx-auto bg-white/5 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Tickets Found</h3>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                You haven't purchased any tickets yet. Explore our amazing exhibitions and book your spot!
              </p>
              <Button onClick={() => router.push("/exhibitions")} className="btn-accent px-8 py-3 rounded-full">
                Browse Exhibitions
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="card-modern hover-lift">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white text-xl mb-2 flex items-center">
                            <div className="w-2 h-2 bg-gradient-to-r from-zinc-400 to-zinc-600 rounded-full mr-3"></div>
                            {ticket.exhibition_name}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-zinc-500" />
                              {ticket.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-zinc-500" />
                              {formatShortDate(ticket.start_date)} - {formatShortDate(ticket.end_date)}
                            </div>
                            <div className="flex items-center">
                              <Ticket className="h-4 w-4 mr-1 text-zinc-500" />
                              {ticket.tickets_purchased} ticket(s)
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col gap-2">
                          {getStatusBadge(ticket.status)}
                          {getExhibitionStatus(ticket.start_date, ticket.end_date)}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-6 mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">Payment Method</p>
                            <p className="text-white capitalize font-medium">
                              {ticket.payment_method?.replace("_", " ") || "Credit Card"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">Total Amount</p>
                            <p className="text-white font-semibold text-lg">
                              $
                              {ticket.total_amount?.toFixed(2) ||
                                (ticket.tickets_purchased * ticket.ticket_price).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">Purchase Date</p>
                            <p className="text-white font-medium">{formatShortDate(ticket.purchase_date)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500">Per Ticket</p>
                            <p className="text-white font-medium">
                              {
                                typeof ticket.ticket_price === 'number' && !isNaN(ticket.ticket_price)
                                  ? `$${ticket.ticket_price.toFixed(2)}`
                                  : 'N/A'
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                        <div className="text-sm text-zinc-500">
                          <span className="text-zinc-400">Ticket ID:</span> #{ticket.id}
                          {ticket.payment_id && (
                            <span className="ml-4">
                              <span className="text-zinc-400">Payment ID:</span> {ticket.payment_id}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => downloadTicket(ticket)}
                            variant="outline"
                            size="sm"
                            className="btn-modern"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            onClick={() => router.push(`/exhibitions/${ticket.exhibition_id}`)}
                            size="sm"
                            className="btn-accent"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            View Exhibition
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
