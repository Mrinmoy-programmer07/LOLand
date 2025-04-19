"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import confetti from "canvas-confetti"
import PageTransition from "@/components/page-transition"

export default function UploadMeme() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const simulateUpload = () => {
    setUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)

          // Trigger confetti when upload completes
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#FF6B6B", "#FFE66D", "#4ECDC4", "#FF8C42", "#6A0572"],
          })

          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-center text-white mb-8">Upload Your Meme</h1>
          <p className="text-center text-[#c4a7e7] mb-12 text-lg">
            Share your creativity with the LOLand community and earn from your humor!
          </p>

          <div className="bg-[#2a0f47]/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#c4a7e7]/30">
            <div
              className={`relative mb-8 h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-[#FF6B6B] bg-[#FF6B6B]/20"
                  : preview
                    ? "border-[#4ECDC4] bg-[#4ECDC4]/10"
                    : "border-[#c4a7e7] bg-[#2a0f47]/30 hover:bg-[#2a0f47]/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleChange} accept="image/*" />

              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Meme preview"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile()
                    }}
                    className="absolute top-2 right-2 bg-[#FF6B6B] text-white p-1 rounded-full hover:bg-[#FF5151] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon size={64} className="text-[#c4a7e7] mb-4" />
                  <p className="text-[#c4a7e7] text-center mb-2">Drag and drop your meme here, or click to browse</p>
                  <p className="text-[#c4a7e7]/70 text-sm text-center">Supports: JPG, PNG, GIF, WEBP (Max 10MB)</p>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-[#c4a7e7] text-lg mb-2 block">
                  Meme Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your meme a catchy title"
                  className="bg-[#2a0f47]/50 border-[#c4a7e7]/50 text-white placeholder:text-[#c4a7e7]/50 h-12 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-[#c4a7e7] text-lg mb-2 block">
                  Tags (comma separated)
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="crypto, funny, nft, defi"
                  className="bg-[#2a0f47]/50 border-[#c4a7e7]/50 text-white placeholder:text-[#c4a7e7]/50 h-12 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-[#c4a7e7] text-lg mb-2 block">
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us the story behind your meme..."
                  className="bg-[#2a0f47]/50 border-[#c4a7e7]/50 text-white placeholder:text-[#c4a7e7]/50 min-h-[100px] text-lg"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="data-[state=checked]:bg-[#4ECDC4]"
                />
                <Label htmlFor="public" className="text-[#c4a7e7] text-lg">
                  Make it Public
                </Label>
              </div>

              {uploadProgress > 0 && (
                <div className="w-full bg-[#2a0f47]/50 rounded-full h-4 mt-4">
                  <div
                    className="bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] h-4 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <Button
                onClick={simulateUpload}
                disabled={!file || uploading}
                className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] hover:from-[#FF5151] hover:to-[#FFD93D] text-black font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 h-16"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin mr-2">🔄</span> Uploading...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload className="mr-2" /> Upload Now
                  </div>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
