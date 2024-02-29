import { In, Repository } from 'typeorm';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from '@src/tokens/tokens.dto';
import { TokensEntity } from '@src/tokens/tokens.entity';
import { TokensFilter } from '@src/tokens/tokens.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/services/common.service';
import { filterService } from '@src/typeorm/services/filter.service';
import { optionsService } from '@src/typeorm/services/options.service';
import { searchService } from '@src/typeorm/services/search.service';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(TokensEntity)
    private readonly tokensRepository: Repository<TokensEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async tokensCreateEntry(tokensDto: TokensDto, token = undefined) {
    if (!token) {
      await this.tokensCreate(tokensDto);
      return true;
    }
    const find = await this.tokensGetAllWhere({
      auth: {
        id: tokensDto.authId,
      },
      refreshToken: token,
    });
    find?.forEach(async (i) => {
      await this.tokensUpdate({
        id: i.id,
        accessToken: tokensDto.accessToken,
        refreshToken: tokensDto.refreshToken,
      })
    });
    return !!find?.length;
  }

  async tokensGenerateOne(data, configKey) {
    const expires = this.configService.get(configKey) || '';
    const token = await this.jwtService.signAsync(
      data,
      expires
        ? { expiresIn: expires }
        : {},
    );
    return token;
  }

  async tokensCreatePair(auth, token = undefined) {
    const data = { id: auth.id };
    const accessToken = await this.tokensGenerateOne(data, 'JWT_ACCESS_EXPIRES');
    const refreshToken = await this.tokensGenerateOne(data, 'JWT_REFRESH_EXPIRES');
    // const accessToken = await this.jwtService.signAsync(data, {
    //   expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
    // });
    // const refreshToken = await this.jwtService.signAsync(data, {
    //   expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
    // });
    const result = await this.tokensCreateEntry({
      auth,
      accessToken,
      refreshToken,
    }, token);
    if (!result) {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    return { accessToken, refreshToken };
  }

  async tokensRefresh(tokensDto: TokensDto, request: any): Promise<TokensDto> {
    const { refreshToken } = tokensDto;
    const sessionToken = request.session.token;
    // console.log('-- request.session', request.session);
    if (!refreshToken || !sessionToken || refreshToken !== sessionToken) {
      throw new UnauthorizedException('Please sign in!');
    }
    let result;
    try {
      result = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    if (!result) {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    const tokens = await this.tokensCreatePair(result.id, refreshToken);
    request.session.token = tokens.refreshToken;
    return tokens;
  }

  async tokensGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TokensEntity[]> {
    return await this.tokensRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async tokensGetAllWhere(
    where: any,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TokensEntity[]> {
    return await this.tokensRepository.find({
      relations: relationsDto?.map(i => i.name),
      where,
    });
  }

  async tokensGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TokensEntity> {
    return await this.tokensRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async tokensGetMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TokensEntity[]> {
    return await this.tokensRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: { id: In(ids?.map(i => Number(i) || 0)) },
    });
  }

  async tokensFilter(
    tokensDto: TokensDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TokensFilter[]> {
    const { root, fields } = commonEntityGetParams(TokensEntity);
    const query = this.tokensRepository.createQueryBuilder(root);
    const where = filterService(tokensDto, root, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async tokensSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<TokensFilter[]> {
    const { root, core, fields } = commonEntityGetParams(TokensEntity);
    const query = this.tokensRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async tokensCreate(tokensDto: TokensDto): Promise<TokensEntity> {
    delete tokensDto.createdAt;
    delete tokensDto.updatedAt;
    return await this.tokensRepository.save({ ...tokensDto });
  }

  async tokensUpdate(tokensDto: TokensDto): Promise<TokensEntity> {
    const { id } = tokensDto;
    if (id === undefined) {
      return;
    }
    return await this.tokensCreate(tokensDto);
  }

  async tokensRemove(id: number): Promise<boolean> {
    const result = await this.tokensRepository.delete({ id });
    return !!result?.affected;
  }

  async tokensRemoveByAuthId(authId: number): Promise<boolean> {
    const result = await this.tokensRepository.delete({ auth: { id: authId }});
    return !!result?.affected;
  }

  async tokensRemoveByToken(refreshToken: string): Promise<boolean> {
    const result = await this.tokensRepository.delete({ refreshToken });
    return !!result?.affected;
  }
}
