import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { PostsDto } from '@src/posts/posts.dto';
import { RolesDto } from '@src/roles/roles.dto';
import { RolesTypes } from '@src/roles/roles.enum';
import { RolesService } from '@src/roles/roles.service';
import { AuthDto } from '@src/auth/auth.dto';

type Subjects = InferSubjects<typeof PostsDto | typeof RolesDto> | 'all';

export type AppAbility = Ability<[RolesTypes, Subjects]>;

@Injectable()
export class RolesFactory {
  constructor(private readonly rolesService: RolesService) {}

  async createRole(auth: AuthDto) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[RolesTypes, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    const roles = [];
    await this.rolesService.rolesGetByAuthId(auth.id).then((r) => {
      r?.forEach((i) => {
        roles.push(i.type);
      });
    });

    if (roles.indexOf(RolesTypes.manage) >= 0) {
      can(RolesTypes.manage, 'all'); // read-write access to everything
    } else {
      can(RolesTypes.read, 'all'); // read-only access to everything
    }

    can(RolesTypes.update, PostsDto, { auth });
    cannot(RolesTypes.delete, PostsDto, { isPublished: true });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

/*
использовать:
const roles = await this.RolesFactory.createRole(auth);
roles.can(RolesTypes.read, post); // true
roles.can(RolesTypes.delete, post); // false
roles.can(RolesTypes.create, post); // false
*/
