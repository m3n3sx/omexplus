import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"

const CmsDashboardWidget = () => {
  return (
    <Container>
      <Heading level="h2">CMS Dashboard</Heading>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Strony</h3>
          <p className="text-2xl">0</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Posty na blogu</h3>
          <p className="text-2xl">0</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Banery</h3>
          <p className="text-2xl">0</p>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default CmsDashboardWidget
