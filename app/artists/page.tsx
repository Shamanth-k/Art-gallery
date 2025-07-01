"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Palette, Star } from "lucide-react"
import { motion } from "framer-motion"

interface Artist {
  id: number
  name: string
  country: string
  biography: string
  date_of_birth: string
  date_of_death: string | null
  art_piece: string
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/artists")
      const data = await response.json()
      setArtists(data || [])
    } catch (error) {
      console.error("Error fetching artists:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).getFullYear().toString()
  }

  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-pink-500 to-purple-500",
      "from-purple-500 to-orange-500",
      "from-orange-500 to-pink-500",
      "from-green-500 to-purple-500",
      "from-pink-500 to-orange-500",
    ]
    return gradients[index % gradients.length]
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
                <div className="h-20 bg-slate-700 rounded"></div>
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
            Featured Artists 👨‍🎨
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Discover the visionary creators shaping the future of digital art ✨
          </p>
        </motion.div>

        {artists.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-slate-700">
              <Palette className="h-16 w-16 text-pink-400" />
            </div>
            <p className="text-slate-300 text-lg">No artists available at the moment. 🎨</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-pink-500/50 transition-all duration-300 group hover:scale-105 h-full backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRandomGradient(index)} flex items-center justify-center relative`}
                      >
                        <Palette className="h-6 w-6 text-white" />
                        <div className="absolute -top-1 -right-1 text-lg">{index % 2 === 0 ? "🎨" : "✨"}</div>
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl group-hover:text-pink-400 transition-colors">
                          {artist.name}
                        </CardTitle>
                        <div className="flex items-center text-slate-400 text-sm mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {artist.country}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={`bg-gradient-to-r ${getRandomGradient(index)} text-white border-0`}>
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(artist.date_of_birth)}
                        {artist.date_of_death && ` - ${formatDate(artist.date_of_death)}`}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <CardDescription className="text-slate-300 line-clamp-4">{artist.biography}</CardDescription>

                    {artist.art_piece && (
                      <div className="pt-2 border-t border-slate-700">
                        <p className="text-sm text-slate-200">
                          <span className="text-pink-400 font-medium flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            Featured Work:
                          </span>
                          <span className="ml-2">{artist.art_piece}</span>
                        </p>
                      </div>
                    )}
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
