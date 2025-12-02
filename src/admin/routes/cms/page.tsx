import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button } from "@medusajs/ui"

const CmsPage = () => {
  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading level="h1">System CMS</Heading>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <Heading level="h2">Strony</Heading>
          <p className="text-gray-600 mt-2">Zarządzaj stronami statycznymi</p>
          <Button className="mt-4">Zarządzaj stronami</Button>
        </div>
        
        <div className="p-6 border rounded-lg">
          <Heading level="h2">Blog</Heading>
          <p className="text-gray-600 mt-2">Twórz i edytuj posty na blogu</p>
          <Button className="mt-4">Zarządzaj blogiem</Button>
        </div>
        
        <div className="p-6 border rounded-lg">
          <Heading level="h2">Menu</Heading>
          <p className="text-gray-600 mt-2">Konfiguruj nawigację</p>
          <Button className="mt-4">Edytuj menu</Button>
        </div>
        
        <div className="p-6 border rounded-lg">
          <Heading level="h2">Banery</Heading>
          <p className="text-gray-600 mt-2">Zarządzaj banerami promocyjnymi</p>
          <Button className="mt-4">Zarządzaj banerami</Button>
        </div>
        
        <div className="p-6 border rounded-lg">
          <Heading level="h2">FAQ</Heading>
          <p className="text-gray-600 mt-2">Często zadawane pytania</p>
          <Button className="mt-4">Zarządzaj FAQ</Button>
        </div>
        
        <div className="p-6 border rounded-lg">
          <Heading level="h2">Ustawienia</Heading>
          <p className="text-gray-600 mt-2">Globalne ustawienia strony</p>
          <Button className="mt-4">Edytuj ustawienia</Button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "CMS",
  icon: "document-text",
})

export default CmsPage
