import { ValueTransformer } from 'typeorm';

/**
 * TypeORM transformer for DATE columns
 * PostgreSQL returns DATE as string (YYYY-MM-DD), this converts to/from Date objects
 */
export const DateTransformer: ValueTransformer = {
  /**
   * Called when writing to database
   * Converts Date to ISO string for PostgreSQL DATE column
   */
  to: (value: Date | string | null | undefined): string | null => {
    if (!value) return null;
    if (value instanceof Date) {
      // Return only the date part (YYYY-MM-DD) for DATE columns
      return value.toISOString().split('T')[0];
    }
    // If already a string, return as-is
    return value;
  },

  /**
   * Called when reading from database
   * PostgreSQL returns DATE as string "YYYY-MM-DD"
   */
  from: (value: string | Date | null | undefined): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    // Parse the date string - add T00:00:00Z to ensure UTC parsing
    const date = new Date(`${value}T00:00:00Z`);
    return isNaN(date.getTime()) ? null : date;
  },
};