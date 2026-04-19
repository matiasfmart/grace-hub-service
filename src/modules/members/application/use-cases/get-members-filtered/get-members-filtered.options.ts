/**
 * Options for GetMembersFilteredUseCase
 *
 * Defines filter, search, and pagination options for member queries.
 * This is an options interface for the use case input.
 */
export interface GetMembersFilteredOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  statusFilters?: string[];
  roleFilters?: string[];
  gdiFilters?: string[];
  areaFilters?: string[];
  joinDateFrom?: string;
  joinDateTo?: string;
  ageMin?: number;
  ageMax?: number;
}

/**
 * Normalize pagination options with defaults and limits
 */
export function normalizePaginationOptions(options: GetMembersFilteredOptions): {
  page: number;
  pageSize: number;
  offset: number;
} {
  let page = options.page ?? 1;
  let pageSize = options.pageSize ?? 10;

  // Ensure valid pagination values
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = 10;
  if (pageSize > 100) pageSize = 100; // Max page size for safety

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}
