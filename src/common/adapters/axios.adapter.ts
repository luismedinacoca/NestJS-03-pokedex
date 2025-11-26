import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const { data } = await this.axios.get<T>(url);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error(`This is an error - Check logs`);
    }
  }
}
