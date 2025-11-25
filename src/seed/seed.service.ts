import { Injectable } from '@nestjs/common';
import { PokeResponse, Result } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed(): Promise<Result[]> {
    await this.pokemonModel.deleteMany({}); // delete * from pokemons;
    // 1. FETCH request:
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: PokeResponse = await response.json();

    // 2. Map data:
    const inserts = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      // return promises to create()
      return this.pokemonModel.create({ name, no });
    });

    // 3. Wait for ALL insertions to finish concurrently
    await Promise.all(inserts);

    return data.results;
  }
}

//! Axios Format
/*
import {Injectable} from '@nestjs/common'; 
import axios, { AxiosInsstance } from 'axios'; 
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable() 
export class SeedService{ 
  private reaadonly axios: AxiosInstance = axios; 
  async executeSeed() { 
    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=1`); 
    data.results.forEach( async({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      const pokemon = await this.pokemonModel.create({ name, no });
    })
    return data.results; 
  } 
}
*/
