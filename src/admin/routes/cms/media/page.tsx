import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button } from "@medusajs/ui"

const MediaLibraryPage = () => {
  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading level="h1">Biblioteka Mediów</Heading>
        <Button>Dodaj pliki</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Grid z obrazami */}
        <div className="border rounded p-2">
          <img src="/placeholder.jpg" alt="Media" className="w-full" />
          <p className="text-sm mt-2">image.jpg</p>
          <p className="text-xs text-gray-500">1.2 MB</p>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Media",
})

export default MediaLibraryPage
