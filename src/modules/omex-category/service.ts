import { MedusaService } from "@medusajs/framework/utils"

interface CreateCategoryDTO {
  name: string
  slug: string
  parent_id?: string
  icon?: string
  description?: string
}

interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

interface Category {
  id: string
  name: string
  slug: string
  parent_id?: string
  icon?: string
  description?: string
  children?: Category[]
}

class OmexCategoryService extends MedusaService({}) {
  async createCategory(data: CreateCategoryDTO) {
    if (!data.name || !data.slug) {
      throw new Error("Name and slug are required")
    }

    // Validate parent exists if parent_id provided
    if (data.parent_id) {
      // In real implementation, check if parent exists
    }

    return {
      id: `cat_${Date.now()}`,
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    }
  }

  async updateCategory(id: string, data: UpdateCategoryDTO) {
    if (!id) {
      throw new Error("Category ID is required")
    }

    return {
      id,
      ...data,
      updated_at: new Date(),
    }
  }

  async retrieveCategory(id: string) {
    if (!id) {
      throw new Error("Category ID is required")
    }

    return {
      id,
      name: "Sample Category",
    }
  }

  async listTree(): Promise<Category[]> {
    // In real implementation, fetch all categories and build tree
    // This is a recursive structure where each category can have children
    
    // Example structure:
    // [
    //   {
    //     id: "cat_1",
    //     name: "Hydraulika",
    //     children: [
    //       { id: "cat_2", name: "Pompy", parent_id: "cat_1", children: [...] }
    //     ]
    //   }
    // ]
    
    return []
  }

  async getChildren(parentId: string): Promise<Category[]> {
    if (!parentId) {
      throw new Error("Parent ID is required")
    }

    // In real implementation, fetch categories where parent_id = parentId
    return []
  }

  async getProductsByCategory(categoryId: string, includeSubcategories: boolean = true) {
    if (!categoryId) {
      throw new Error("Category ID is required")
    }

    if (includeSubcategories) {
      // Get all descendant category IDs
      const descendantIds = await this.getDescendantIds(categoryId)
      
      // Fetch products from all these categories
      // In real implementation, query products where category_id IN (categoryId, ...descendantIds)
    }

    return []
  }

  async deleteCategory(id: string, cascade: boolean = false) {
    if (!id) {
      throw new Error("Category ID is required")
    }

    // Check if category has children
    const children = await this.getChildren(id)
    
    if (children.length > 0 && !cascade) {
      throw new Error(
        `Category has ${children.length} subcategories. ` +
        `Set cascade=true to delete all subcategories, or move them to another parent first.`
      )
    }

    return { deleted: true, id, cascade }
  }

  async generatePath(categoryId: string): Promise<string> {
    if (!categoryId) {
      throw new Error("Category ID is required")
    }

    // In real implementation, traverse up the tree to build path
    // Example: /hydraulika/pompy/pompy-tlokowe
    
    const path: string[] = []
    let currentId = categoryId
    
    // Traverse up to root (max 10 levels to prevent infinite loop)
    for (let i = 0; i < 10; i++) {
      const category = await this.retrieveCategory(currentId)
      if (!category) break
      
      path.unshift(category.slug || category.name.toLowerCase().replace(/\s+/g, '-'))
      
      if (!category.parent_id) break
      currentId = category.parent_id
    }

    return '/' + path.join('/')
  }

  private async getDescendantIds(categoryId: string): Promise<string[]> {
    // Recursive function to get all descendant category IDs
    const descendants: string[] = []
    const children = await this.getChildren(categoryId)
    
    for (const child of children) {
      descendants.push(child.id)
      const childDescendants = await this.getDescendantIds(child.id)
      descendants.push(...childDescendants)
    }
    
    return descendants
  }

  private async buildTree(categories: Category[], parentId: string | null = null): Promise<Category[]> {
    // Helper to build hierarchical tree from flat list
    const tree: Category[] = []
    
    for (const category of categories) {
      if (category.parent_id === parentId) {
        const children = await this.buildTree(categories, category.id)
        tree.push({
          ...category,
          children: children.length > 0 ? children : undefined,
        })
      }
    }
    
    return tree
  }
}

export default OmexCategoryService
