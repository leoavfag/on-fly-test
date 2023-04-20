import { PartialType } from '@nestjs/mapped-types';
import { CreateDespesaDto } from './create-despesa.dto';

export class UpdateDespesaDto extends PartialType(CreateDespesaDto) {
  descricao: string;
  date: Date;
  valor: number;
}
