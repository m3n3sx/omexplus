import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Select, Button, Input, Table } from "@medusajs/ui"
import { useState } from "react"

const I18nManagementPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("pl")
  
  const languages = [
    { value: "pl", label: "🇵🇱 Polski" },
    { value: "en", label: "🇬🇧 English" },
    { value: "de", label: "🇩🇪 Deutsch" },
    { value: "uk", label: "🇺🇦 Українська" },
  ]

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading level="h1">Zarządzanie Tłumaczeniami</Heading>
        <div className="flex gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {languages.map(lang => (
                <Select.Item key={lang.value} value={lang.value}>
                  {lang.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Button>Eksportuj</Button>
          <Button>Importuj</Button>
        </div>
      </div>

      <div className="mb-6">
        <Input placeholder="Szukaj tłumaczeń..." />
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Klucz</Table.HeaderCell>
            <Table.HeaderCell>Tłumaczenie</Table.HeaderCell>
            <Table.HeaderCell>Akcje</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>common.welcome</Table.Cell>
            <Table.Cell>
              <Input defaultValue="Witamy" />
            </Table.Cell>
            <Table.Cell>
              <Button size="small">Zapisz</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Tłumaczenia",
  icon: "language",
})

export default I18nManagementPage
