import { IsString } from 'class-validator';

export class QueryPurchasesDto {
  @IsString()
  userId: string;
}
