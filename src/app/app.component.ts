import { Component, OnInit } from '@angular/core';
import { ApiSenderService } from './api-sender.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  endpoint: string;
  selectedRequestMethod: string;
  requestMethods: Array<string>;
  responseData: any;
  responseError: any;
  requestBody: any;
  requestBodyDataTypes: any;
  availableDataTypes: Array<string>;
  requestHeaders: any;
  endpointError: string;
  loadingState: boolean;

  initValues() {
    this.endpoint = '';
    this.selectedRequestMethod = 'GET';
    this.requestMethods = [
      'GET',
      'POST'
    ];
    this.availableDataTypes = [
      'String',
      'Number',
      'Boolean'
    ];
    this.requestBody = [{ key: '', value: '' }];
    this.requestBodyDataTypes = [''];
    this.requestHeaders = [{ key: 'VallalatiInformaciosRendszerek', value: 'Postman clone' }];
    this.endpointError = '';
    this.loadingState = false;
  }

  constructor(private client: ApiSenderService) {
    this.initValues();
  }

  ngOnInit() {}

  getArrayByType(type: string) {
    let array;
    if (type === 'Body') {
      array = this.requestBody;
    } else if (type === 'Headers') {
      array = this.requestHeaders;
    }
    return array;
  }

  addItem(where: string) {
    const array = this.getArrayByType(where);
    array.push({ key: '', value: '' });
    if (where === 'Body') {
      this.requestBodyDataTypes.push('');
    }
  }

  isAddDisabled(type: string) {
    const array = this.getArrayByType(type);

    if (array.length > 0) {
      if (array[array.length - 1].key === '' ||
        array[array.length - 1].value === ''
      ) {
        return true;
      }
    }

    return false;
  }

  removeItem(index: number, type: string) {
    const array = this.getArrayByType(type);
    array.splice(index, 1);
  }

  validateUrl(text: string) {
    const urlRegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    return urlRegExp.test(text);
  }

  createObjectFromArray(type: string) {
    const array = this.getArrayByType(type);

    let objectFromArray: {};
    objectFromArray = array.reduce((object, item) => {
        object[item.key] = item.value;
        return object;
      }, {});

    return objectFromArray;
  }

  sendRequest() {
    this.endpointError = '';
    this.responseData = '';
    this.responseError = '';

    if (!this.endpoint) {
      this.endpointError = 'Endpoint is a Required value';
      return;
    }
    if (!this.validateUrl(this.endpoint)) {
      this.endpointError = 'Please enter a valid URL';
      return;
    }

    this.loadingState = true;
    switch (this.selectedRequestMethod) {
      case 'GET': {
        this.client.sendGetRequest(
          this.endpoint,
          this.createObjectFromArray('Headers')
        ).subscribe(
          data => {
            this.loadingState = false;
            this.responseData = JSON.stringify(data, undefined, 4);
          },
          error => {
            this.loadingState = false;
            this.responseError = JSON.stringify(error, undefined, 4);
          }
        );
        break;
      }
      case 'POST': {
        this.client.sendPostRequest(
          this.endpoint,
          this.createObjectFromArray('Body'),
          this.createObjectFromArray('Headers')
        ).subscribe(
          data => {
            this.loadingState = false;
            this.responseData = JSON.stringify(data, undefined, 4);
          },
          error => {
            this.loadingState = false;
            this.responseError = JSON.stringify(error, undefined, 4);
          }
        );
        break;
      }
    }

    //this.initValues();
  }
}
