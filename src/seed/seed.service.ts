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
  ) { }

  async executeSeed(): Promise<Result[]> {
    // 1. FETCH request:
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=15");
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    const data: PokeResponse = await response.json();

    // 2. Map data:
    const pokemonToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      return { name, no };
    });

    // 3. Insert into DB:
    await this.pokemonModel.insertMany(pokemonToInsert);

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
