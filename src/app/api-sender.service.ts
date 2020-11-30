import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiSenderService {

  constructor(private client: HttpClient) {}

  sendGetRequest(url: string, headers: any) {
    headers = new HttpHeaders(headers);
    return this.client.get(url, { headers });
  }

  sendPostRequest(url: string, body: object, headers: any) {
    headers = new HttpHeaders(headers);
    return this.client.post(url, body, { headers });
  }
}
