import { ValueObject } from './ValueObject';
import { Result } from '../core/Result';

interface PaginationPageProps {
  page: number;
}

export class PaginationPage extends ValueObject<PaginationPageProps> {
  get value(): number {
    return this.props.page;
  }

  private constructor(props: PaginationPageProps) {
    super(props);
  }

  static create(page: string): Result<PaginationPage> {
    if (!page) {
      return Result.ok<PaginationPage>(new PaginationPage({ page: 0 }));
    }

    try {
      const int = parseInt(page, 10);
      if (isNaN(int))
        return Result.fail<PaginationPage>('Failed to parse page');
      return Result.ok<PaginationPage>(new PaginationPage({ page: int }));
    } catch (e) {
      return Result.fail<PaginationPage>('Failed to parse page');
    }
  }

  public offset(pageSize: number): number {
    return this.value * pageSize;
  }
}
