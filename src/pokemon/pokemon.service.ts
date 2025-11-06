import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new BadRequestException(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Pokemon existe en DB: ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log('❌ Error: ', error);
      throw new InternalServerErrorException(
        `Can't create Pokemon - Check server logs`,
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null | undefined;

    // search by "no"
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // search by MongoID:
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // search by name:
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();

    // Option 1
    /*
    const updatedPokemon = await pokemon.updateOne(updatePokemonDto, { new: true });
    return updatedPokemon;
    Issues:
    - updatedPokemon is updatedin MongoDb
    - pokemon ddoes not reflext the updated values from Postman
    */

    // Option 2:
    /*
    await pokemon.updateOne(updatePokemonDto);
    return { ...pokemon.toJSON(), ...updatePokemonDto };
    */

    // Option 3:
    const updatedPokemon = await this.pokemonModel.findByIdAndUpdate(
      pokemon._id,
      updatePokemonDto,
      { new: true }, // 👉 it returns an updated document
    );
    return updatedPokemon;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
