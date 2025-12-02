import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Table, Badge } from "@medusajs/ui"

const BannersPage = () => {
  const banners = [] // Fetch from API

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading level="h1">Banery Promocyjne</Heading>
        <Button>Dodaj baner</Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Podgląd</Table.HeaderCell>
            <Table.HeaderCell>Tytuł</Table.HeaderCell>
            <Table.HeaderCell>Pozycja</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Okres</Table.HeaderCell>
            <Table.HeaderCell>Akcje</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {banners.map((banner: any) => (
            <Table.Row key={banner.id}>
              <Table.Cell>
                <img src={banner.image} alt={banner.title} className="w-20 h-12 object-cover rounded" />
              </Table.Cell>
              <Table.Cell>{banner.title}</Table.Cell>
              <Table.Cell>{banner.position}</Table.Cell>
              <Table.Cell>
                <Badge color={banner.active ? "green" : "grey"}>
                  {banner.active ? "Aktywny" : "Nieaktywny"}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                {banner.startDate} - {banner.endDate}
              </Table.Cell>
              <Table.Cell>
                <Button variant="secondary" size="small">
                  Edytuj
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Banery",
})

export default BannersPage
