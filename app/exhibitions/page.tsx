"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Ticket, Star } from "lucide-react"
import Link from "next/link"
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

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExhibitions()
  }, [])

  const fetchExhibitions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/exhibitions")
      const data = await response.json()
      setExhibitions(data.exhibitions || [])
    } catch (error) {
      console.error("Error fetching exhibitions:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getAvailableTickets = (exhibition: Exhibition) => {
    return exhibition.ticket_limit - (exhibition.ticket_sold || 0)
  }

  const getStatusBadge = (exhibition: Exhibition) => {
    const now = new Date()
    const startDate = new Date(exhibition.start_date)
    const endDate = new Date(exhibition.end_date)
    const availableTickets = getAvailableTickets(exhibition)

    if (availableTickets <= 0) {
      return <Badge variant="destructive">Sold Out 🚫</Badge>
    } else if (now < startDate) {
      return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Upcoming 🔮</Badge>
    } else if (now >= startDate && now <= endDate) {
      return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">Active ✨</Badge>
    } else {
      return <Badge variant="secondary">Ended 📅</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-6 animate-pulse backdrop-blur-sm">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="h-3 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded mb-4"></div>
                <div className="h-8 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Digital Exhibitions 🎭
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Immerse yourself in cutting-edge digital art experiences from around the world ✨
          </p>
        </motion.div>

        {exhibitions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-slate-700">
              <Star className="h-16 w-16 text-pink-400" />
            </div>
            <p className="text-slate-300 text-lg">No exhibitions available at the moment. 🎨</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-pink-500/50 transition-all duration-300 group hover:scale-105 h-full backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-white text-xl group-hover:text-pink-400 transition-colors">
                        {exhibition.name}
                      </CardTitle>
                      {getStatusBadge(exhibition)}
                    </div>
                    <CardDescription className="text-slate-300 line-clamp-3">{exhibition.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-slate-200 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-pink-400" />
                        {formatDate(exhibition.start_date)} - {formatDate(exhibition.end_date)}
                      </div>
                      <div className="flex items-center text-slate-200 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                        {exhibition.location}
                      </div>
                      <div className="flex items-center text-slate-200 text-sm">
                        <Ticket className="h-4 w-4 mr-2 text-green-400" />${exhibition.ticket_price} per ticket
                      </div>
                      <div className="flex items-center text-slate-200 text-sm">
                        <Users className="h-4 w-4 mr-2 text-orange-400" />
                        {getAvailableTickets(exhibition)} tickets available
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link href={`/exhibitions/${exhibition.id}`}>
                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                          disabled={getAvailableTickets(exhibition) <= 0}
                        >
                          {getAvailableTickets(exhibition) <= 0 ? "Sold Out 🚫" : "View Details ✨"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
