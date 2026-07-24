export interface CreateCategoryDto {
    name: string,
    description?: string,
    image?: string
}


export const CATEGORY_MESSAGE = {
    CREATED: "Category created successfully",
    ALREADY_EXISTS: "Category already exists",
    NOT_FOUND: "Category not found",
    FETCHED: "Categories fetched successfully",
    FETCHED_ONE: "Category fetched successfully",
    UPDATED: "Category updated successfully",
    DELETED: "Category deleted successfully",
}

