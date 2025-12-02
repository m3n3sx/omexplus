import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button } from "@medusajs/ui"

const MenusPage = () => {
  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading level="h1">Menu Nawigacyjne</Heading>
        <Button>Nowe menu</Button>
      </div>

      <div className="space-y-6">
        <div className="border rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Heading level="h2">Menu Główne</Heading>
              <p className="text-gray-600">Lokalizacja: header</p>
            </div>
            <Button variant="secondary">Edytuj</Button>
          </div>
          
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Produkty</p>
              <div className="ml-4 mt-2 space-y-1">
                <p className="text-sm text-gray-600">→ Kategoria 1</p>
                <p className="text-sm text-gray-600">→ Kategoria 2</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Blog</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Kontakt</p>
            </div>
          </div>
        </div>

        <div className="border rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Heading level="h2">Menu Stopki</Heading>
              <p className="text-gray-600">Lokalizacja: footer</p>
            </div>
            <Button variant="secondary">Edytuj</Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Menu",
})

export default MenusPage
