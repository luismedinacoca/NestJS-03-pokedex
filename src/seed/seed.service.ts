import { Injectable } from '@nestjs/common';
import { PokeResponse, Result } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  async executeSeed(): Promise<Result[]> {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    const data: PokeResponse = await response.json();
    
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      //console.log(segments); // [ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '1', '' ]

      const no: number = +segments[ segments.length - 2]; // str -> number
      console.log({name, no}); //{ name: 'bulbasaur', no: 1 }
    });
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
    return data.results; 
  } 
}
*/
