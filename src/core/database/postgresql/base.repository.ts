import { Repository, DataSource } from 'typeorm';

/**
 * Base repository with support for stored procedures
 */
export abstract class BaseRepository<T> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly dataSource: DataSource,
  ) {}

  /**
   * Execute a stored procedure
   * @param procedureName Name of the stored procedure
   * @param params Parameters to pass to the procedure
   * @returns Result from the stored procedure
   */
  protected async executeStoredProcedure<R = any>(
    procedureName: string,
    params: any[] = [],
  ): Promise<R> {
    const paramPlaceholders = params.map((_, index) => `$${index + 1}`).join(', ');
    const query = `SELECT * FROM ${procedureName}(${paramPlaceholders})`;

    const result = await this.dataSource.query(query, params);
    return result;
  }

  /**
   * Execute a raw SQL query
   * @param query SQL query
   * @param params Query parameters
   * @returns Query result
   */
  protected async executeQuery<R = any>(
    query: string,
    params: any[] = [],
  ): Promise<R> {
    return await this.dataSource.query(query, params);
  }

  /**
   * Begin a transaction
   */
  async withTransaction<R>(
    work: (manager: any) => Promise<R>,
  ): Promise<R> {
    return await this.dataSource.transaction(work);
  }
}
