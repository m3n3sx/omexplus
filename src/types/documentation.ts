export type DocumentType = "datasheet" | "manual" | "guide" | "warranty" | "certification" | "catalog"

export interface TechnicalDocument {
  id: string
  manufacturer_id?: string
  title: string
  document_type: DocumentType
  file_url: string
  file_size?: number
  mime_type?: string
  products?: string[]
  created_at: Date
  updated_at: Date
}

export interface CreateDocumentDTO {
  manufacturer_id?: string
  title: string
  document_type: DocumentType
  file_url: string
  file_size?: number
  mime_type?: string
  products?: string[]
}

export interface UpdateDocumentDTO extends Partial<CreateDocumentDTO> {}

export interface DocumentStats {
  total: number
  by_type: Record<DocumentType, number>
  total_size: number
}
