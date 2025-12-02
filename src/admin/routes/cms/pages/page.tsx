import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Table } from "@medusajs/ui"
import { PencilSquare, Trash } from "@medusajs/icons"

const PagesListPage = () => {
  const pages = [] // Fetch from API

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading level="h1">Strony</Heading>
        <Button>Dodaj stronę</Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tytuł</Table.HeaderCell>
            <Table.HeaderCell>Slug</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Data utworzenia</Table.HeaderCell>
            <Table.HeaderCell>Akcje</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pages.map((page: any) => (
            <Table.Row key={page.id}>
              <Table.Cell>{page.title}</Table.Cell>
              <Table.Cell>{page.slug}</Table.Cell>
              <Table.Cell>
                {page.published ? "Opublikowana" : "Szkic"}
              </Table.Cell>
              <Table.Cell>{page.createdAt}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  <Button variant="secondary" size="small">
                    <PencilSquare />
                  </Button>
                  <Button variant="danger" size="small">
                    <Trash />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Strony",
})

export default PagesListPage
