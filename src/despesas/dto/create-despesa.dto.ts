import {
  IsCurrency,
  IsDate,
  IsNotEmpty,
  MaxDate,
  MaxLength,
} from 'class-validator'

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
  date: Date

  @IsNotEmpty({
    message: 'Informe o valor da despesa',
  })
  @IsCurrency({
    allow_negatives: false,
    parens_for_negatives: false,
    negative_sign_before_digits: false,
    negative_sign_after_digits: false,
    allow_negative_sign_placeholder: false,
    thousands_separator: '.',
    decimal_separator: ',',
    allow_decimal: true,
    require_decimal: true,
    digits_after_decimal: [2],
  })
  valor: number
}
