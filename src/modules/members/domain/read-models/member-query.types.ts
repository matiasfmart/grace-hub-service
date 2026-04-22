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
  /** ISO date string (YYYY-MM-DD). Filters by join_date >= value */
  joinDateFrom?: string;
  /** ISO date string (YYYY-MM-DD). Filters by join_date <= value */
  joinDateTo?: string;
  /** Minimum age (inclusive), calculated from birth_date */
  ageMin?: number;
  /** Maximum age (inclusive), calculated from birth_date */
  ageMax?: number;
  /** Column to sort by (whitelisted) */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
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
