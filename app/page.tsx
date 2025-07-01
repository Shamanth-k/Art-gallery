"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Calendar, Users, Ticket, ArrowRight, Sparkles, Globe, Star, Zap, Heart } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30" />

        {/* Background Art Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-white/10 to-zinc-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-zinc-300/20 to-zinc-500/30 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-zinc-400/10 to-zinc-600/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-white to-zinc-300 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-10 w-10 text-zinc-900" />
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-white/20 rounded-full blur-xl animate-ping"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">Future Gallery</h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-8 leading-relaxed">
              Experience art in the digital age. Discover masterpieces, meet visionary artists, and immerse yourself in
              exhibitions that transcend reality. ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/exhibitions">
                <Button size="lg" className="btn-accent px-8 py-3 rounded-full shadow-modern-lg">
                  Explore Exhibitions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/artists">
                <Button size="lg" variant="outline" className="btn-modern px-8 py-3 rounded-full bg-transparent">
                  Meet Artists
                  <Palette className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Redefining Art Experience</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Step into the future of art curation with our cutting-edge platform 🚀
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Palette,
                title: "Digital Artists",
                description: "Discover emerging and established artists pushing creative boundaries",
                color: "from-zinc-400 to-zinc-600",
                emoji: "🎨",
              },
              {
                icon: Calendar,
                title: "Virtual Exhibitions",
                description: "Immersive exhibitions accessible from anywhere in the world",
                color: "from-zinc-300 to-zinc-500",
                emoji: "🖼️",
              },
              {
                icon: Ticket,
                title: "Smart Ticketing",
                description: "Seamless booking system with instant confirmation",
                color: "from-zinc-500 to-zinc-700",
                emoji: "🎫",
              },
              {
                icon: Globe,
                title: "Global Access",
                description: "Connect with art lovers and creators worldwide",
                color: "from-zinc-200 to-zinc-400",
                emoji: "🌍",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-modern hover-lift group">
                  <CardHeader className="text-center">
                    <div className="relative mb-4">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute top-0 right-0 text-2xl">{feature.emoji}</div>
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-zinc-400 text-center">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-zinc-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Artworks</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Explore stunning digital masterpieces from our featured artists 🎭
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Neon Dreams",
                artist: "Maya Chen",
                image: "/placeholder.svg?height=300&width=400",
                description: "A vibrant exploration of cyberpunk aesthetics",
              },
              {
                title: "Quantum Flux",
                artist: "Elena Volkov",
                image: "/placeholder.svg?height=300&width=400",
                description: "Physics meets art in this dynamic piece",
              },
              {
                title: "Virtual Aztec",
                artist: "Alex Rivera",
                image: "/placeholder.svg?height=300&width=400",
                description: "Traditional culture in digital space",
              },
            ].map((artwork, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="card-modern hover-lift group overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={artwork.image || "/placeholder.svg"}
                      alt={artwork.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">{artwork.title}</h3>
                      <p className="text-sm text-zinc-300">by {artwork.artist}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-zinc-400 text-sm">{artwork.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: "500+", label: "Digital Artworks", icon: Palette, emoji: "🎨" },
              { number: "50+", label: "Featured Artists", icon: Users, emoji: "👨‍🎨" },
              { number: "25+", label: "Active Exhibitions", icon: Star, emoji: "⭐" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-zinc-400 to-zinc-600 mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                  <div className="absolute -top-2 -right-2 text-2xl">{stat.emoji}</div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-zinc-400 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                <Heart className="h-8 w-8 text-zinc-400 animate-pulse" />
                <Zap className="h-8 w-8 text-zinc-300 animate-pulse delay-500" />
                <Sparkles className="h-8 w-8 text-zinc-200 animate-pulse delay-1000" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Explore the Future of Art? 🚀</h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join thousands of art enthusiasts discovering the next generation of creativity ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="btn-accent px-8 py-3 rounded-full shadow-modern-lg">
                  Get Started
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/exhibitions">
                <Button size="lg" variant="outline" className="btn-modern px-8 py-3 rounded-full bg-transparent">
                  Browse Exhibitions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
