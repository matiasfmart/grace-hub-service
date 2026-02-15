/**
 * Member Query Types
 *
 * Types for query operations on members.
 * Defined in domain layer as part of repository contract.
 */

/**
 * Filter options for member queries
 */
export interface MemberFilterOptions {
  page: number;
  pageSize: number;
  offset: number;
  searchTerm?: string;
  statusFilters?: string[];
  roleFilters?: string[];
  gdiFilters?: string[];
  areaFilters?: string[];
}

/**
 * Result of paginated members query
 */
export interface PaginatedMembersResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
