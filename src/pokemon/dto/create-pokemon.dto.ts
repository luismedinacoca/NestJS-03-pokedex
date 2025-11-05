import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  // isInt, isPossitive, minLength(2)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;

  // isString, minLength(2)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(3)
  name: string;
}
