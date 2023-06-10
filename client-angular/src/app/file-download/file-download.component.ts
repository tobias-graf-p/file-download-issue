import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.css']
})
export class FileDownloadComponent {
  private readonly apiUrl1 = 'http://192.168.178.43:3000/file1';
  private readonly apiUrl2 = 'http://192.168.178.43:3000/file2';

  constructor(private http: HttpClient) {}

  downloadFile1(): void {
    this.downloadFile(this.apiUrl1);
  }

  downloadFile2(): void {
    this.downloadFile(this.apiUrl2);
  }

  private downloadFile(apiUrl: string): void {
    this.http
      .get(apiUrl, { responseType: 'blob', observe: 'response' })
      .subscribe(response => {
        const fileName = this.getFileNameFromHeaders(response.headers);
        console.log('fileName', fileName);

        //
        // Approach #1: a-tag with object url
        //

        console.log('approach #1');
        const data = response.body;
        if (!data) {
          console.log('no data');
          return;
        }
        console.log('data', data);
        const url = URL.createObjectURL(data);
        console.log('url', url);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        console.log('before click');
        link.click();
        console.log('after click');
        setTimeout(() => URL.revokeObjectURL(url), 0);

        //
        // Approach #2: FileSaver.js
        //

        // console.log('approach #2');
        // const blob = new Blob([response.body as Blob], {type: 'text/plain'});
        // console.log('blob', blob);
        // console.log('before saveAs');
        // saveAs(blob, fileName);
        // console.log('after saveAs');

        //
        // Approach #3: FileReader
        //

        // console.log('approach #3');
        // const reader = new FileReader();
        // reader.onloadend = function(e) {
        //   console.log('reader.result', reader.result);
        //   const link = document.createElement('a');
        //   document.body.appendChild(link);
        //   link.href = reader.result as string;
        //   link.download = fileName;
        //   const clickEvent = new MouseEvent('click');
        //   console.log('before dispatch click event');
        //   link.dispatchEvent(clickEvent);
        //   console.log('after dispatch click event');
        //   setTimeout(()=> {
        //     document.body.removeChild(link);
        //   }, 0)
        // }
        // console.log('response.body', response.body);
        // console.log('before readAsDataURL');
        // reader.readAsDataURL(response.body as Blob);
        // console.log('after readAsDataURL');
      });
  }

  private getFileNameFromHeaders(headers: HttpHeaders): string {
    const contentDisposition = headers.get('Content-Disposition');
    if (!contentDisposition) {
      return 'unknown.txt';
    }
    let fileName = contentDisposition
      .split(';')[1]
      .split('=')[1];
    if (fileName.startsWith('"')) {
      fileName = fileName.substring(1, fileName.length - 1);
    }
    if (fileName.endsWith('"')) {
      fileName = fileName.substring(0, fileName.length - 2);
    }
    return decodeURI(fileName);
  }
}
