import { Controller, Get, Param } from '@nestjs/common';

@Controller('roles')
export class RolesController {
  @Get('member/:memberId')
  async getMemberRoles(@Param('memberId') memberId: string) {
    // TODO: Implementar GetMemberRolesUseCase con cálculo dinámico
    return { message: `Get roles for member ${memberId}` };
  }

  @Get('calculate/:memberId')
  async calculateMemberRoles(@Param('memberId') memberId: string) {
    // TODO: Implementar CalculateMemberRolesUseCase
    // Este endpoint recalcula y actualiza los roles de un miembro
    return { message: `Calculate and update roles for member ${memberId}` };
  }
}
