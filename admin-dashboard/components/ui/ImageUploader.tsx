"use client"

import { useState, useRef, DragEvent } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Button from "./Button"

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files))
    }
  }

  const uploadFiles = async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)

    try {
      // Show message about uploading to CDN
      alert(
        `To add images:\n\n` +
        `1. Upload your images to a CDN or image hosting service (e.g., Cloudinary, AWS S3, Imgur)\n` +
        `2. Copy the public URL\n` +
        `3. Click "Add URL" button and paste the URL\n\n` +
        `For now, use the "Add URL" button to add image URLs directly.`
      )
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleUrlAdd = () => {
    const url = prompt(
      "Enter image URL:\n\n" +
      "Example: https://example.com/product-image.jpg\n\n" +
      "Tip: Upload your image to Cloudinary, Imgur, or AWS S3 first, then paste the URL here."
    )
    if (url && url.trim()) {
      if (images.length >= maxImages) {
        alert(`Maximum ${maxImages} images allowed`)
        return
      }
      // Validate URL format
      try {
        new URL(url)
        onChange([...images, url.trim()])
      } catch {
        alert("Invalid URL format. Please enter a valid image URL starting with http:// or https://")
      }
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images]
    const newIndex = direction === 'left' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= images.length) return
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        
        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
          Add Product Images
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Upload images to a CDN first, then add URLs here
        </p>
        
        <div className="flex justify-center space-x-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleUrlAdd}
            disabled={uploading}
          >
            Add Image URL
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Info
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          {images.length} / {maxImages} images
        </p>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'left')}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-white rounded-full hover:bg-red-50"
                    title="Remove"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'right')}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
              
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
