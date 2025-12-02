import { MedusaService } from "@medusajs/framework/utils"

interface CreateDocumentDTO {
  manufacturer_id?: string
  title: string
  document_type: "datasheet" | "manual" | "guide" | "warranty" | "certification" | "catalog"
  file_url: string
  file_size?: number
  mime_type?: string
  products?: string[]
}

interface UpdateDocumentDTO extends Partial<CreateDocumentDTO> {}

class DocumentationService extends MedusaService({}) {
  /**
   * Create a technical document
   */
  async createDocument(data: CreateDocumentDTO) {
    if (!data.title || !data.document_type || !data.file_url) {
      throw new Error("Title, document type, and file URL are required")
    }

    const validTypes = ["datasheet", "manual", "guide", "warranty", "certification", "catalog"]
    if (!validTypes.includes(data.document_type)) {
      throw new Error(`Invalid document type. Must be one of: ${validTypes.join(", ")}`)
    }

    const documentData = {
      id: `doc_${Date.now()}`,
      manufacturer_id: data.manufacturer_id,
      title: data.title,
      document_type: data.document_type,
      file_url: data.file_url,
      file_size: data.file_size,
      mime_type: data.mime_type || this.detectMimeType(data.file_url),
      products: data.products || [],
      created_at: new Date(),
      updated_at: new Date(),
    }

    // In real implementation, save to database
    return documentData
  }

  /**
   * Update a technical document
   */
  async updateDocument(documentId: string, data: UpdateDocumentDTO) {
    if (!documentId) {
      throw new Error("Document ID is required")
    }

    // In real implementation, update in database
    return {
      id: documentId,
      ...data,
      updated_at: new Date(),
    }
  }

  /**
   * Get documents for a product
   */
  async getProductDocuments(productId: string) {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    // In real implementation, query documents where products array contains productId
    // Using PostgreSQL: WHERE products @> '["product_id"]'::jsonb
    return []
  }

  /**
   * Get documents for a manufacturer
   */
  async getManufacturerDocuments(manufacturerId: string, documentType?: string) {
    if (!manufacturerId) {
      throw new Error("Manufacturer ID is required")
    }

    const conditions = [`manufacturer_id = '${manufacturerId}'`]

    if (documentType) {
      conditions.push(`document_type = '${documentType}'`)
    }

    // In real implementation, query database
    return []
  }

  /**
   * Associate document with products
   */
  async associateWithProducts(documentId: string, productIds: string[]) {
    if (!documentId || !productIds || productIds.length === 0) {
      throw new Error("Document ID and product IDs are required")
    }

    // In real implementation, update document's products array
    return {
      document_id: documentId,
      products: productIds,
      updated_at: new Date(),
    }
  }

  /**
   * Remove document association from products
   */
  async removeFromProducts(documentId: string, productIds: string[]) {
    if (!documentId || !productIds || productIds.length === 0) {
      throw new Error("Document ID and product IDs are required")
    }

    // In real implementation, remove product IDs from document's products array
    return {
      document_id: documentId,
      removed_products: productIds,
      updated_at: new Date(),
    }
  }

  /**
   * Upload document (placeholder for file upload logic)
   */
  async uploadDocument(file: Buffer, filename: string, manufacturerId?: string) {
    if (!file || !filename) {
      throw new Error("File and filename are required")
    }

    // In real implementation:
    // 1. Upload file to S3 or local storage
    // 2. Get file URL
    // 3. Create document record

    const fileUrl = `/uploads/documents/${filename}`
    const fileSize = file.length

    return {
      file_url: fileUrl,
      file_size: fileSize,
      mime_type: this.detectMimeType(filename),
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string) {
    if (!documentId) {
      throw new Error("Document ID is required")
    }

    // In real implementation:
    // 1. Get document from database
    // 2. Delete file from storage
    // 3. Delete database record

    return {
      deleted: true,
      id: documentId,
    }
  }

  /**
   * Search documents
   */
  async searchDocuments(query: string, filters: { document_type?: string; manufacturer_id?: string } = {}) {
    if (!query || query.trim().length === 0) {
      throw new Error("Search query is required")
    }

    const conditions = [`title ILIKE '%${query}%'`]

    if (filters.document_type) {
      conditions.push(`document_type = '${filters.document_type}'`)
    }

    if (filters.manufacturer_id) {
      conditions.push(`manufacturer_id = '${filters.manufacturer_id}'`)
    }

    // In real implementation, query database
    return []
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(manufacturerId?: string) {
    // In real implementation, aggregate document counts by type
    const stats = {
      total: 0,
      by_type: {
        datasheet: 0,
        manual: 0,
        guide: 0,
        warranty: 0,
        certification: 0,
        catalog: 0,
      },
      total_size: 0,
    }

    return stats
  }

  // Helper methods

  private detectMimeType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase()

    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      zip: "application/zip",
    }

    return mimeTypes[ext || ""] || "application/octet-stream"
  }
}

export default DocumentationService
