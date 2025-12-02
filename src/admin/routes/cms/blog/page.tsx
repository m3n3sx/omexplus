import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Table, Badge } from "@medusajs/ui"

const BlogListPage = () => {
  const posts = [] // Fetch from API

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading level="h1">Blog</Heading>
        <Button>Nowy post</Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tytuł</Table.HeaderCell>
            <Table.HeaderCell>Autor</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Data publikacji</Table.HeaderCell>
            <Table.HeaderCell>Akcje</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {posts.map((post: any) => (
            <Table.Row key={post.id}>
              <Table.Cell>{post.title}</Table.Cell>
              <Table.Cell>{post.author}</Table.Cell>
              <Table.Cell>
                <Badge color={post.published ? "green" : "grey"}>
                  {post.published ? "Opublikowany" : "Szkic"}
                </Badge>
              </Table.Cell>
              <Table.Cell>{post.publishedAt || "-"}</Table.Cell>
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
  label: "Blog",
})

export default BlogListPage
