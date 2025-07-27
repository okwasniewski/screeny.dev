"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, Copy, Sparkles, Github, Twitter } from "lucide-react"
// Added theme toggle component
import { ModeToggle } from "@/components/mode-toggle"

const BACKGROUND_OPTIONS = [
  { name: "Blue Gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Purple Gradient", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Green Gradient", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Orange Gradient", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Dark", value: "#1a1a1a" },
  { name: "Light", value: "#f8f9fa" },
  { name: "White", value: "#ffffff" },
]

export default function ScreenshotEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [borderRadius, setBorderRadius] = useState([16])
  const [padding, setPadding] = useState([40])
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUND_OPTIONS[0].value)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  // Get image dimensions when image is loaded
  useEffect(() => {
    if (uploadedImage) {
      const img = new Image()
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
        })
      }
      img.src = uploadedImage
    }
  }, [uploadedImage])

  // Canvas rendering function to generate final image
  const renderToCanvas = useCallback(async () => {
    if (!uploadedImage || !canvasRef.current) return null

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    // Create image object
    const img = new Image()
    img.crossOrigin = "anonymous"

    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        try {
          // Calculate canvas dimensions based on image and padding
          const paddingValue = padding[0]
          const canvasWidth = img.width + paddingValue * 2
          const canvasHeight = img.height + paddingValue * 2

          // Set canvas size
          canvas.width = canvasWidth
          canvas.height = canvasHeight

          // Clear canvas
          ctx.clearRect(0, 0, canvasWidth, canvasHeight)

          // Draw background first
          if (selectedBackground.startsWith("linear-gradient")) {
            // Parse gradient - improved regex to handle spaces and colors properly
            const gradientMatch = selectedBackground.match(/linear-gradient$$(\d+)deg,\s*(.+)$$/)
            if (gradientMatch) {
              const angle = Number.parseInt(gradientMatch[1])
              const colorStops = gradientMatch[2].split(",").map((s) => s.trim())

              // Convert angle to canvas coordinates
              const angleRad = ((angle - 90) * Math.PI) / 180
              const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight)
              const x1 = canvasWidth / 2 - (Math.cos(angleRad) * diagonal) / 2
              const y1 = canvasHeight / 2 - (Math.sin(angleRad) * diagonal) / 2
              const x2 = canvasWidth / 2 + (Math.cos(angleRad) * diagonal) / 2
              const y2 = canvasHeight / 2 + (Math.sin(angleRad) * diagonal) / 2

              const gradient = ctx.createLinearGradient(x1, y1, x2, y2)

              // Parse and add color stops - improved parsing
              colorStops.forEach((colorStop, index) => {
                const match = colorStop.match(/(.+?)\s+(\d+)%/)
                if (match) {
                  const color = match[1].trim()
                  const percentage = Number.parseInt(match[2]) / 100
                  gradient.addColorStop(percentage, color)
                } else {
                  // If no percentage specified, distribute evenly
                  const position = colorStops.length === 1 ? 0 : index / (colorStops.length - 1)
                  gradient.addColorStop(position, colorStop.trim())
                }
              })

              ctx.fillStyle = gradient
            } else {
              // Fallback to solid color if gradient parsing fails
              ctx.fillStyle = "#667eea"
            }
          } else {
            // Solid color background
            ctx.fillStyle = selectedBackground
          }

          // Fill the entire canvas with background (this ensures padding area gets the background)
          ctx.fillRect(0, 0, canvasWidth, canvasHeight)

          // Now draw the image with border radius and proper positioning
          ctx.save()

          // Position the image with padding offset
          const imageX = paddingValue
          const imageY = paddingValue
          const imageWidth = img.width
          const imageHeight = img.height
          const radius = borderRadius[0]

          // Create rounded rectangle clipping path for the image
          ctx.beginPath()
          ctx.moveTo(imageX + radius, imageY)
          ctx.lineTo(imageX + imageWidth - radius, imageY)
          ctx.quadraticCurveTo(imageX + imageWidth, imageY, imageX + imageWidth, imageY + radius)
          ctx.lineTo(imageX + imageWidth, imageY + imageHeight - radius)
          ctx.quadraticCurveTo(
            imageX + imageWidth,
            imageY + imageHeight,
            imageX + imageWidth - radius,
            imageY + imageHeight,
          )
          ctx.lineTo(imageX + radius, imageY + imageHeight)
          ctx.quadraticCurveTo(imageX, imageY + imageHeight, imageX, imageY + imageHeight - radius)
          ctx.lineTo(imageX, imageY + radius)
          ctx.quadraticCurveTo(imageX, imageY, imageX + radius, imageY)
          ctx.closePath()
          ctx.clip()

          // Draw the image within the clipped area (positioned with padding)
          ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight)
          ctx.restore()

          // Return canvas as data URL
          resolve(canvas.toDataURL("image/png", 1.0))
        } catch (error) {
          console.error("Canvas rendering error:", error)
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      img.src = uploadedImage
    })
  }, [uploadedImage, borderRadius, padding, selectedBackground])

  // Download functionality - improved error handling
  const handleDownload = useCallback(async () => {
    try {
      const dataUrl = await renderToCanvas()
      if (!dataUrl) {
        console.error("Failed to render canvas")
        return
      }

      const link = document.createElement("a")
      link.download = `screenshot-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }, [renderToCanvas])

  // Copy to clipboard functionality - improved error handling
  const handleCopyToClipboard = useCallback(async () => {
    try {
      const dataUrl = await renderToCanvas()
      if (!dataUrl) {
        console.error("Failed to render canvas")
        return
      }

      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])

      console.log("Image copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy image to clipboard:", error)
    }
  }, [renderToCanvas])

  // Add paste event handler
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile()
          if (blob) {
            const reader = new FileReader()
            reader.onload = (e) => {
              setUploadedImage(e.target?.result as string)
            }
            reader.readAsDataURL(blob)
            break
          }
        }
      }
    }

    // Add event listener
    document.addEventListener("paste", handlePaste)

    // Clean up
    return () => {
      document.removeEventListener("paste", handlePaste)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-8">
          {/* Added theme toggle in header */}
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            {/* Updated to use theme-aware text color */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              screeny.dev
            </h1>
            <Badge variant="secondary" className="ml-2 text-xs">
              Beta
            </Badge>
          </div>
          {/* Updated to use theme-aware text color */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your screenshots with beautiful backgrounds and rounded corners. Upload, customize, and download
            in seconds.
          </p>
        </div>

        {!uploadedImage ? (
          // Only show upload area when no image is uploaded
          <Card className="p-6 max-w-md mx-auto">
            <Label className="text-sm font-medium mb-4 block">Upload Screenshot</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Updated to use theme-aware text color */}
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Drop your screenshot here or click to browse \n (You can also paste it with ⌘ + v)</p>
              <p className="text-xs text-muted-foreground/70">PNG, JPG, GIF up to 10MB</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
          </Card>
        ) : (
          // Show editor interface after image is uploaded
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Area (smaller when image is already uploaded) */}
              <Card className="p-6">
                <Label className="text-sm font-medium mb-4 block">Upload Screenshot</Label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Updated to use theme-aware text color */}
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Drop a new screenshot or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </Card>

              {/* Background Selection */}
              <Card className="p-6">
                <Label className="text-sm font-medium mb-4 block">Background</Label>
                <div className="grid grid-cols-2 gap-2">
                  {BACKGROUND_OPTIONS.map((bg) => (
                    <button
                      key={bg.name}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        selectedBackground === bg.value
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ background: bg.value }}
                      onClick={() => setSelectedBackground(bg.value)}
                      title={bg.name}
                    />
                  ))}
                </div>
              </Card>

              {/* Border Radius Control */}
              <Card className="p-6">
                <Label className="text-sm font-medium mb-4 block">Border Radius: {borderRadius[0]}px</Label>
                <Slider
                  value={borderRadius}
                  onValueChange={setBorderRadius}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </Card>

              {/* Padding Control */}
              <Card className="p-6">
                <Label className="text-sm font-medium mb-4 block">Padding: {padding[0]}px</Label>
                <Slider value={padding} onValueChange={setPadding} max={100} min={10} step={5} className="w-full" />
              </Card>

              {/* Export Buttons */}
              <div className="space-y-3">
                <Button className="w-full" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={handleCopyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <Label className="text-sm font-medium mb-4 block">Preview</Label>
                <div
                  className="rounded-lg overflow-hidden"
                  style={{
                    background: selectedBackground,
                    width: "fit-content",
                    maxWidth: "100%",
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      padding: `${padding[0]}px`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Screenshot preview"
                      className="max-w-full object-contain shadow-2xl"
                      style={{
                        borderRadius: `${borderRadius[0]}px`,
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Added footer section with creator info and links */}
        <footer className="mt-12 text-center text-sm text-muted-foreground pb-6">
          {/* Added profile picture - made smaller */}
          <div className="flex justify-center mb-3">
            <img
              src="https://github.com/okwasniewski.png?size=200"
              alt="Oskar Kwaśniewski"
              className="h-10 w-10 rounded-full border-2 border-border"
            />
          </div>
          <p>Built by Oskar Kwaśniewski</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a
              href="https://github.com/okwasniewski"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://x.com/o_kwasniewski"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
