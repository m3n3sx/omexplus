import OmexCategoryService from "../service"
import { CreateCategoryInput } from "../repository"

describe("OmexCategoryService - Category Repository", () => {
  let service: OmexCategoryService

  beforeEach(() => {
    service = new OmexCategoryService()
  })

  describe("create", () => {
    it("should create a new category with valid data", async () => {
      const input: CreateCategoryInput = {
        name: "Filtry",
        slug: "filtry",
        description: "Wszystkie typy filtrów",
        priority: 1,
      }

      const category = await service.create(input)

      expect(category).toBeDefined()
      expect(category.id).toBeDefined()
      expect(category.name).toBe("Filtry")
      expect(category.slug).toBe("filtry")
      expect(category.description).toBe("Wszystkie typy filtrów")
      expect(category.priority).toBe(1)
      expect(category.parent_id).toBeNull()
      expect(category.created_at).toBeDefined()
      expect(category.updated_at).toBeDefined()
    })

    it("should throw error if name is missing", async () => {
      const input: CreateCategoryInput = {
        name: "",
        slug: "test",
      }

      await expect(service.create(input)).rejects.toThrow("Name and slug are required")
    })

    it("should throw error if slug is missing", async () => {
      const input: CreateCategoryInput = {
        name: "Test",
        slug: "",
      }

      await expect(service.create(input)).rejects.toThrow("Name and slug are required")
    })

    it("should throw error if slug is not unique", async () => {
      const input: CreateCategoryInput = {
        name: "Filtry",
        slug: "filtry",
      }

      await service.create(input)

      await expect(service.create(input)).rejects.toThrow('Category with slug "filtry" already exists')
    })

    it("should create category with parent_id", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const child = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent.id,
      })

      expect(child.parent_id).toBe(parent.id)
    })

    it("should throw error if parent_id does not exist", async () => {
      const input: CreateCategoryInput = {
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: "non-existent-id",
      }

      await expect(service.create(input)).rejects.toThrow('Parent category with ID "non-existent-id" not found')
    })

    it("should throw error if slug is not in kebab-case format", async () => {
      const invalidSlugs = [
        "Filtry", // uppercase
        "filtry_powietrza", // underscore
        "filtry powietrza", // space
        "filtry.powietrza", // dot
        "-filtry", // starts with hyphen
        "filtry-", // ends with hyphen
        "filtry--powietrza", // double hyphen
      ]

      for (const slug of invalidSlugs) {
        const input: CreateCategoryInput = {
          name: "Test",
          slug,
        }

        await expect(service.create(input)).rejects.toThrow("kebab-case")
      }
    })

    it("should accept valid kebab-case slugs", async () => {
      const validSlugs = [
        "filtry",
        "filtry-powietrza",
        "filtry-powietrza-glowne",
        "a",
        "a1",
        "a1b2c3",
        "a-1-b-2",
      ]

      for (const slug of validSlugs) {
        const input: CreateCategoryInput = {
          name: "Test",
          slug,
        }

        const category = await service.create(input)
        expect(category.slug).toBe(slug)
      }
    })
  })

  describe("findById", () => {
    it("should find category by ID", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const found = await service.findById(created.id)

      expect(found).toBeDefined()
      expect(found?.id).toBe(created.id)
      expect(found?.name).toBe("Filtry")
    })

    it("should return null if category not found", async () => {
      const found = await service.findById("non-existent-id")
      expect(found).toBeNull()
    })

    it("should throw error if ID is empty", async () => {
      await expect(service.findById("")).rejects.toThrow("Category ID is required")
    })
  })

  describe("findBySlug", () => {
    it("should find category by slug", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const found = await service.findBySlug("filtry")

      expect(found).toBeDefined()
      expect(found?.id).toBe(created.id)
      expect(found?.slug).toBe("filtry")
    })

    it("should return null if category not found", async () => {
      const found = await service.findBySlug("non-existent-slug")
      expect(found).toBeNull()
    })

    it("should throw error if slug is empty", async () => {
      await expect(service.findBySlug("")).rejects.toThrow("Slug is required")
    })
  })

  describe("findByParentId", () => {
    it("should find all direct children of a parent", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const child1 = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent.id,
      })

      const child2 = await service.create({
        name: "Filtry hydrauliczne",
        slug: "filtry-hydrauliczne",
        parent_id: parent.id,
      })

      const children = await service.findByParentId(parent.id)

      expect(children).toHaveLength(2)
      expect(children.map((c) => c.id)).toContain(child1.id)
      expect(children.map((c) => c.id)).toContain(child2.id)
    })

    it("should return empty array if no children", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const children = await service.findByParentId(parent.id)

      expect(children).toHaveLength(0)
    })

    it("should find top-level categories when parent_id is null", async () => {
      const cat1 = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cat2 = await service.create({
        name: "Hydraulika",
        slug: "hydraulika",
      })

      const topLevel = await service.findByParentId(null)

      expect(topLevel.length).toBeGreaterThanOrEqual(2)
      expect(topLevel.map((c) => c.id)).toContain(cat1.id)
      expect(topLevel.map((c) => c.id)).toContain(cat2.id)
    })
  })

  describe("findAll", () => {
    it("should return all categories", async () => {
      const cat1 = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cat2 = await service.create({
        name: "Hydraulika",
        slug: "hydraulika",
      })

      const all = await service.findAll()

      expect(all.length).toBeGreaterThanOrEqual(2)
      expect(all.map((c) => c.id)).toContain(cat1.id)
      expect(all.map((c) => c.id)).toContain(cat2.id)
    })
  })

  describe("update", () => {
    it("should update category fields", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const updated = await service.update(created.id, {
        name: "Filtry (Updated)",
        description: "Updated description",
      })

      expect(updated.name).toBe("Filtry (Updated)")
      expect(updated.description).toBe("Updated description")
      expect(updated.slug).toBe("filtry")
    })

    it("should update slug if unique", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const updated = await service.update(created.id, {
        slug: "filtry-updated",
      })

      expect(updated.slug).toBe("filtry-updated")

      const oldSlug = await service.findBySlug("filtry")
      expect(oldSlug).toBeNull()

      const newSlug = await service.findBySlug("filtry-updated")
      expect(newSlug?.id).toBe(created.id)
    })

    it("should throw error if new slug is not unique", async () => {
      const cat1 = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cat2 = await service.create({
        name: "Hydraulika",
        slug: "hydraulika",
      })

      await expect(service.update(cat2.id, { slug: "filtry" })).rejects.toThrow(
        'Category with slug "filtry" already exists'
      )
    })

    it("should throw error if category not found", async () => {
      await expect(service.update("non-existent-id", { name: "Test" })).rejects.toThrow(
        'Category with ID "non-existent-id" not found'
      )
    })

    it("should throw error if new slug is not in kebab-case format", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const invalidSlugs = [
        "Filtry", // uppercase
        "filtry_powietrza", // underscore
        "filtry powietrza", // space
        "filtry.powietrza", // dot
        "-filtry", // starts with hyphen
        "filtry-", // ends with hyphen
      ]

      for (const slug of invalidSlugs) {
        await expect(service.update(created.id, { slug })).rejects.toThrow("kebab-case")
      }
    })

    it("should update parent_id", async () => {
      const parent1 = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const parent2 = await service.create({
        name: "Hydraulika",
        slug: "hydraulika",
      })

      const child = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent1.id,
      })

      const updated = await service.update(child.id, {
        parent_id: parent2.id,
      })

      expect(updated.parent_id).toBe(parent2.id)
    })
  })

  describe("delete", () => {
    it("should delete a category", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      await service.delete(created.id)

      const found = await service.findById(created.id)
      expect(found).toBeNull()
    })

    it("should orphan children when deleting parent", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const child = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent.id,
      })

      await service.delete(parent.id)

      const orphaned = await service.findById(child.id)
      expect(orphaned?.parent_id).toBeNull()
    })

    it("should throw error if category not found", async () => {
      await expect(service.delete("non-existent-id")).rejects.toThrow(
        'Category with ID "non-existent-id" not found'
      )
    })
  })

  describe("buildTree", () => {
    it("should build hierarchical tree structure", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const filtraPowietrza = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: filtry.id,
      })

      const filtraHydrauliczne = await service.create({
        name: "Filtry hydrauliczne",
        slug: "filtry-hydrauliczne",
        parent_id: filtry.id,
      })

      const tree = await service.buildTree()

      const filtryNode = tree.find((n) => n.id === filtry.id)
      expect(filtryNode).toBeDefined()
      expect(filtryNode?.children).toHaveLength(2)
      expect(filtryNode?.children?.map((c) => c.id)).toContain(filtraPowietrza.id)
      expect(filtryNode?.children?.map((c) => c.id)).toContain(filtraHydrauliczne.id)
    })

    it("should handle multi-level hierarchy", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const filtraPowietrza = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: filtry.id,
      })

      const filtraGlowne = await service.create({
        name: "Filtry główne",
        slug: "filtry-glowne",
        parent_id: filtraPowietrza.id,
      })

      const tree = await service.buildTree()

      const filtryNode = tree.find((n) => n.id === filtry.id)
      const filtraPowietrzaNode = filtryNode?.children?.find((n) => n.id === filtraPowietrza.id)
      expect(filtraPowietrzaNode?.children).toHaveLength(1)
      expect(filtraPowietrzaNode?.children?.[0].id).toBe(filtraGlowne.id)
    })
  })

  describe("getBreadcrumb", () => {
    it("should return breadcrumb path from root to category", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const filtraPowietrza = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: filtry.id,
      })

      const filtraGlowne = await service.create({
        name: "Filtry główne",
        slug: "filtry-glowne",
        parent_id: filtraPowietrza.id,
      })

      const breadcrumb = await service.getBreadcrumb(filtraGlowne.id)

      expect(breadcrumb).toHaveLength(3)
      expect(breadcrumb[0].id).toBe(filtry.id)
      expect(breadcrumb[1].id).toBe(filtraPowietrza.id)
      expect(breadcrumb[2].id).toBe(filtraGlowne.id)
    })

    it("should return single item for top-level category", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const breadcrumb = await service.getBreadcrumb(filtry.id)

      expect(breadcrumb).toHaveLength(1)
      expect(breadcrumb[0].id).toBe(filtry.id)
    })

    it("should throw error if category ID is empty", async () => {
      await expect(service.getBreadcrumb("")).rejects.toThrow("Category ID is required")
    })
  })

  describe("getDescendants", () => {
    it("should return all descendants of a category", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const filtraPowietrza = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: filtry.id,
      })

      const filtraGlowne = await service.create({
        name: "Filtry główne",
        slug: "filtry-glowne",
        parent_id: filtraPowietrza.id,
      })

      const filtraZapasowe = await service.create({
        name: "Filtry zapasowe",
        slug: "filtry-zapasowe",
        parent_id: filtraPowietrza.id,
      })

      const descendants = await service.getDescendants(filtry.id)

      expect(descendants).toHaveLength(3)
      expect(descendants.map((d) => d.id)).toContain(filtraPowietrza.id)
      expect(descendants.map((d) => d.id)).toContain(filtraGlowne.id)
      expect(descendants.map((d) => d.id)).toContain(filtraZapasowe.id)
    })

    it("should return empty array if no descendants", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const descendants = await service.getDescendants(filtry.id)

      expect(descendants).toHaveLength(0)
    })
  })

  describe("isSlugUnique", () => {
    it("should return true for unique slug", async () => {
      const isUnique = await service.isSlugUnique("unique-slug")
      expect(isUnique).toBe(true)
    })

    it("should return false for existing slug", async () => {
      await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const isUnique = await service.isSlugUnique("filtry")
      expect(isUnique).toBe(false)
    })

    it("should return true if slug exists but excludeId matches", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const isUnique = await service.isSlugUnique("filtry", created.id)
      expect(isUnique).toBe(true)
    })

    it("should return false if slug exists and excludeId does not match", async () => {
      const cat1 = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cat2 = await service.create({
        name: "Hydraulika",
        slug: "hydraulika",
      })

      const isUnique = await service.isSlugUnique("filtry", cat2.id)
      expect(isUnique).toBe(false)
    })
  })

  describe("wouldCreateCircularReference", () => {
    it("should return false if no circular reference", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const child = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent.id,
      })

      const wouldCircle = await service.wouldCreateCircularReference(child.id, parent.id)
      expect(wouldCircle).toBe(false)
    })

    it("should return true if would create circular reference", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const child = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent.id,
      })

      const wouldCircle = await service.wouldCreateCircularReference(parent.id, child.id)
      expect(wouldCircle).toBe(true)
    })

    it("should return false if newParentId is null", async () => {
      const category = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const wouldCircle = await service.wouldCreateCircularReference(category.id, null)
      expect(wouldCircle).toBe(false)
    })
  })

  describe("find with filters", () => {
    it("should filter by parent_id", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const child1 = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent.id,
      })

      const child2 = await service.create({
        name: "Filtry hydrauliczne",
        slug: "filtry-hydrauliczne",
        parent_id: parent.id,
      })

      const result = await service.find({ parent_id: parent.id })

      expect(result.categories).toHaveLength(2)
      expect(result.count).toBe(2)
    })

    it("should filter by slug", async () => {
      await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const result = await service.find({ slug: "filtry" })

      expect(result.categories).toHaveLength(1)
      expect(result.categories[0].slug).toBe("filtry")
    })

    it("should support pagination", async () => {
      await service.create({ name: "Cat1", slug: "cat1" })
      await service.create({ name: "Cat2", slug: "cat2" })
      await service.create({ name: "Cat3", slug: "cat3" })

      const result = await service.find({}, { limit: 2, offset: 0 })

      expect(result.categories.length).toBeLessThanOrEqual(2)
    })
  })

  describe("getAllCategories with caching", () => {
    it("should return all categories", async () => {
      const cat1 = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cat2 = await service.create({
        name: "Hydraulika",
        slug: "hydraulika",
      })

      const all = await service.getAllCategories()

      expect(all.length).toBeGreaterThanOrEqual(2)
      expect(all.map((c) => c.id)).toContain(cat1.id)
      expect(all.map((c) => c.id)).toContain(cat2.id)
    })

    it("should cache results on second call", async () => {
      await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cacheManager = service.getCacheManager()
      const initialSize = cacheManager.size()

      // First call - should populate cache
      await service.getAllCategories()
      const sizeAfterFirst = cacheManager.size()

      // Second call - should use cache
      await service.getAllCategories()
      const sizeAfterSecond = cacheManager.size()

      expect(sizeAfterFirst).toBeGreaterThan(initialSize)
      expect(sizeAfterSecond).toBe(sizeAfterFirst)
    })
  })

  describe("getCategoryBySlug with caching", () => {
    it("should find category by slug", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const found = await service.getCategoryBySlug("filtry")

      expect(found).toBeDefined()
      expect(found?.id).toBe(created.id)
      expect(found?.slug).toBe("filtry")
    })

    it("should return null for non-existent slug", async () => {
      const found = await service.getCategoryBySlug("non-existent")
      expect(found).toBeNull()
    })

    it("should cache results", async () => {
      const created = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cacheManager = service.getCacheManager()

      // First call - should populate cache
      await service.getCategoryBySlug("filtry")
      const cached = cacheManager.get<Category>("category_slug_filtry")

      expect(cached).toBeDefined()
      if (cached) {
        expect((cached as Category).id).toBe(created.id)
        expect((cached as Category).slug).toBe("filtry")
      }
    })

    it("should throw error if slug is empty", async () => {
      await expect(service.getCategoryBySlug("")).rejects.toThrow("Slug is required")
    })
  })

  describe("getSubcategories with caching", () => {
    it("should return direct subcategories", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const child1 = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent.id,
      })

      const child2 = await service.create({
        name: "Filtry hydrauliczne",
        slug: "filtry-hydrauliczne",
        parent_id: parent.id,
      })

      const subcategories = await service.getSubcategories(parent.id)

      expect(subcategories).toHaveLength(2)
      expect(subcategories.map((c) => c.id)).toContain(child1.id)
      expect(subcategories.map((c) => c.id)).toContain(child2.id)
    })

    it("should cache results", async () => {
      const parent = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: parent.id,
      })

      const cacheManager = service.getCacheManager()

      // First call - should populate cache
      await service.getSubcategories(parent.id)
      const cached = cacheManager.get(`subcategories_${parent.id}`)

      expect(cached).toBeDefined()
      expect(cached).toHaveLength(1)
    })

    it("should throw error if parent ID is empty", async () => {
      await expect(service.getSubcategories("")).rejects.toThrow("Parent ID is required")
    })
  })

  describe("getCategoryTree with caching", () => {
    it("should return hierarchical tree structure", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const filtraPowietrza = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: filtry.id,
      })

      const tree = await service.getCategoryTree()

      const filtryNode = tree.find((n) => n.id === filtry.id)
      expect(filtryNode).toBeDefined()
      expect(filtryNode?.children).toHaveLength(1)
      expect(filtryNode?.children?.[0].id).toBe(filtraPowietrza.id)
    })

    it("should cache results", async () => {
      await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cacheManager = service.getCacheManager()

      // First call - should populate cache
      await service.getCategoryTree()
      const cached = cacheManager.get("category_tree")

      expect(cached).toBeDefined()
      expect(Array.isArray(cached)).toBe(true)
    })
  })

  describe("getBreadcrumbPath with caching", () => {
    it("should return breadcrumb path", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const filtraPowietrza = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: filtry.id,
      })

      const breadcrumb = await service.getBreadcrumbPath(filtraPowietrza.id)

      expect(breadcrumb).toHaveLength(2)
      expect(breadcrumb[0].id).toBe(filtry.id)
      expect(breadcrumb[1].id).toBe(filtraPowietrza.id)
    })

    it("should cache results", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cacheManager = service.getCacheManager()

      // First call - should populate cache
      await service.getBreadcrumbPath(filtry.id)
      const cached = cacheManager.get(`breadcrumb_${filtry.id}`)

      expect(cached).toBeDefined()
      expect(Array.isArray(cached)).toBe(true)
    })

    it("should throw error if category ID is empty", async () => {
      await expect(service.getBreadcrumbPath("")).rejects.toThrow("Category ID is required")
    })
  })

  describe("invalidateCache", () => {
    it("should clear all caches", async () => {
      await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cacheManager = service.getCacheManager()

      // Populate cache
      await service.getAllCategories()
      expect(cacheManager.size()).toBeGreaterThan(0)

      // Invalidate cache
      await service.invalidateCache()
      expect(cacheManager.size()).toBe(0)
    })
  })

  describe("rebuildCache", () => {
    it("should rebuild all caches", async () => {
      const filtry = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const filtraPowietrza = await service.create({
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        parent_id: filtry.id,
      })

      const cacheManager = service.getCacheManager()

      // Clear cache
      cacheManager.invalidateAll()
      expect(cacheManager.size()).toBe(0)

      // Rebuild cache
      await service.rebuildCache()
      expect(cacheManager.size()).toBeGreaterThan(0)

      // Verify caches are populated
      const allCategories = cacheManager.get("all_categories")
      expect(allCategories).toBeDefined()
      expect(allCategories).toHaveLength(2)

      const tree = cacheManager.get("category_tree")
      expect(tree).toBeDefined()

      const breadcrumb = cacheManager.get(`breadcrumb_${filtraPowietrza.id}`)
      expect(breadcrumb).toBeDefined()
    })
  })

  describe("cache invalidation on mutations", () => {
    it("should invalidate cache when creating category", async () => {
      const cacheManager = service.getCacheManager()

      // Populate cache
      await service.getAllCategories()
      expect(cacheManager.size()).toBeGreaterThan(0)

      // Create new category - should invalidate cache
      await service.create({
        name: "Hydraulika",
        slug: "hydraulika",
      })

      // Cache should be cleared for all_categories and tree
      const allCategories = cacheManager.get("all_categories")
      expect(allCategories).toBeNull()
    })

    it("should invalidate cache when updating category", async () => {
      const category = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cacheManager = service.getCacheManager()

      // Populate cache
      await service.getCategoryBySlug("filtry")
      expect(cacheManager.get("category_slug_filtry")).toBeDefined()

      // Update category - should invalidate cache
      await service.update(category.id, {
        name: "Filtry (Updated)",
      })

      // Cache should be cleared
      expect(cacheManager.get("category_slug_filtry")).toBeNull()
    })

    it("should invalidate cache when deleting category", async () => {
      const category = await service.create({
        name: "Filtry",
        slug: "filtry",
      })

      const cacheManager = service.getCacheManager()

      // Populate cache
      await service.getCategoryBySlug("filtry")
      expect(cacheManager.get("category_slug_filtry")).toBeDefined()

      // Delete category - should invalidate cache
      await service.delete(category.id)

      // Cache should be cleared
      expect(cacheManager.get("category_slug_filtry")).toBeNull()
    })
  })
})
