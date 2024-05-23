import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { PostsDto } from '@src/posts/posts.dto';
import { AuthRolesDto } from '@src/auth_roles/auth_roles.dto';
import { AuthRolesTypes } from '@src/auth_roles/auth_roles.enum';
import { AuthRolesService } from '@src/auth_roles/auth_roles.service';
import { AuthDto } from '@src/auth/auth.dto';

type Subjects = InferSubjects<typeof PostsDto | typeof AuthRolesDto> | 'all';

export type AppAbility = Ability<[AuthRolesTypes, Subjects]>;

@Injectable()
export class AuthRolesFactory {
  constructor(private readonly rolesService: AuthRolesService) {}

  async createRole(auth: AuthDto) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[AuthRolesTypes, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    const roles = [];
    await this.rolesService.getByAuthId(auth.id).then((r) => {
      r?.forEach((i) => {
        roles.push(i.type);
      });
    });

    if (roles.indexOf(AuthRolesTypes.manage) >= 0) {
      can(AuthRolesTypes.manage, 'all'); // read-write access to everything
    } else {
      can(AuthRolesTypes.read, 'all'); // read-only access to everything
    }

    can(AuthRolesTypes.update, PostsDto, { auth });
    cannot(AuthRolesTypes.delete, PostsDto, { isPublished: true });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

/*
использовать:
const roles = await this.AuthRolesFactory.createRole(auth);
roles.can(AuthRolesTypes.read, post); // true
roles.can(AuthRolesTypes.delete, post); // false
roles.can(AuthRolesTypes.create, post); // false
*/
