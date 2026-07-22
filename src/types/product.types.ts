export interface CreateProductInput {
    name: string;
    description: string;
    shortDescription?: string;
    brand: string;
    status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
    isFeatured?: boolean;
    categoryId: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> { }