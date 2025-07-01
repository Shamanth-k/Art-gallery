"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface AddArtistDialogProps {
  onSuccess: () => void
}

export function AddArtistDialog({ onSuccess }: AddArtistDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    biography: "",
    date_of_birth: "",
    date_of_death: "",
    art_piece: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/artists/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          date_of_death: formData.date_of_death || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Artist added successfully",
        })
        setFormData({
          name: "",
          country: "",
          biography: "",
          date_of_birth: "",
          date_of_death: "",
          art_piece: "",
        })
        setOpen(false)
        onSuccess()
      } else {
        throw new Error("Failed to add artist")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add artist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Artist
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800/95 border-slate-700 max-w-md backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Artist</DialogTitle>
          <DialogDescription className="text-slate-400">Add a new artist to the gallery collection.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-slate-300">
              Country
            </Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography" className="text-slate-300">
              Biography
            </Label>
            <Textarea
              id="biography"
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth" className="text-slate-300">
                Birth Date
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_death" className="text-slate-300">
                Death Date
              </Label>
              <Input
                id="date_of_death"
                type="date"
                value={formData.date_of_death}
                onChange={(e) => setFormData({ ...formData, date_of_death: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="art_piece" className="text-slate-300">
              Featured Artwork
            </Label>
            <Input
              id="art_piece"
              value={formData.art_piece}
              onChange={(e) => setFormData({ ...formData, art_piece: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-transparent border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {loading ? "Adding..." : "Add Artist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
