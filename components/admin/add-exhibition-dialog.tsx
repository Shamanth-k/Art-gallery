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

interface AddExhibitionDialogProps {
  onSuccess: () => void
}

export function AddExhibitionDialog({ onSuccess }: AddExhibitionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    ticket_price: "",
    ticket_limit: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/exhibitions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          ticket_price: Number.parseFloat(formData.ticket_price),
          ticket_limit: Number.parseInt(formData.ticket_limit),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Exhibition added successfully",
        })
        setFormData({
          name: "",
          start_date: "",
          end_date: "",
          location: "",
          ticket_price: "",
          ticket_limit: "",
          description: "",
        })
        setOpen(false)
        onSuccess()
      } else {
        const data = await response.json()
        throw new Error(data.message || "Failed to add exhibition")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add exhibition",
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
          Add Exhibition
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800/95 border-slate-700 max-w-2xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Exhibition</DialogTitle>
          <DialogDescription className="text-slate-400">Create a new exhibition for the gallery.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                Exhibition Name *
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
              <Label htmlFor="location" className="text-slate-300">
                Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-slate-300">
                Start Date *
              </Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-slate-300">
                End Date *
              </Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticket_price" className="text-slate-300">
                Ticket Price ($) *
              </Label>
              <Input
                id="ticket_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.ticket_price}
                onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket_limit" className="text-slate-300">
                Ticket Limit *
              </Label>
              <Input
                id="ticket_limit"
                type="number"
                min="1"
                value={formData.ticket_limit}
                onChange={(e) => setFormData({ ...formData, ticket_limit: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white"
              rows={4}
              required
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
              {loading ? "Creating..." : "Create Exhibition"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
