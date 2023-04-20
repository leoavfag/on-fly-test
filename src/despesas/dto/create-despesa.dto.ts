import { Transform } from 'class-transformer'
import { IsDate, IsNotEmpty, MaxDate, MaxLength, Min } from 'class-validator'

export class CreateDespesaDto {
  @IsNotEmpty({
    message: 'Informe a descriação da despesa',
  })
  @MaxLength(191, {
    message: 'O endereço de email deve ter menos de 200 caracteres',
  })
  descricao: string

  @IsNotEmpty({
    message: 'Informe a data da despesa',
  })
  @IsDate()
  @MaxDate(new Date(), {
    message: 'A data da despesa deve ser menor ou igual a data atual',
  })
  @Transform(({ value }) => new Date(value))
  date: Date

  @IsNotEmpty({
    message: 'Informe o valor da despesa',
  })
  @Min(0)
  valor: number
}
