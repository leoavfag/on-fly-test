import { BaseQueryParametersDto } from '../../shared/base-query-parameters.dto'

export class FindUsersQueryDto extends BaseQueryParametersDto {
  name: string
  email: string
}
