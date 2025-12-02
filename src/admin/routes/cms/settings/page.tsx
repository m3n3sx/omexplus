import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Input, Textarea } from "@medusajs/ui"

const SettingsPage = () => {
  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading level="h1">Ustawienia Strony</Heading>
        <Button>Zapisz zmiany</Button>
      </div>

      <div className="space-y-6">
        <div>
          <Heading level="h2">Podstawowe</Heading>
          <div className="grid gap-4 mt-4">
            <Input label="Nazwa strony" placeholder="Mój Sklep" />
            <Textarea label="Opis strony" placeholder="Najlepsze produkty..." />
            <Input label="Logo URL" placeholder="/images/logo.png" />
            <Input label="Favicon URL" placeholder="/images/favicon.ico" />
          </div>
        </div>

        <div>
          <Heading level="h2">Kontakt</Heading>
          <div className="grid gap-4 mt-4">
            <Input label="Email" placeholder="kontakt@sklep.pl" />
            <Input label="Telefon" placeholder="+48 123 456 789" />
            <Textarea label="Adres" placeholder="ul. Przykładowa 1..." />
          </div>
        </div>

        <div>
          <Heading level="h2">Media Społecznościowe</Heading>
          <div className="grid gap-4 mt-4">
            <Input label="Facebook" placeholder="https://facebook.com/..." />
            <Input label="Instagram" placeholder="https://instagram.com/..." />
            <Input label="Twitter" placeholder="https://twitter.com/..." />
          </div>
        </div>

        <div>
          <Heading level="h2">SEO</Heading>
          <div className="grid gap-4 mt-4">
            <Input label="Domyślny tytuł meta" />
            <Textarea label="Domyślny opis meta" />
            <Input label="Google Analytics ID" placeholder="UA-XXXXXXXXX-X" />
            <Input label="Facebook Pixel ID" />
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Ustawienia",
})

export default SettingsPage
