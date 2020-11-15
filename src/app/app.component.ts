import { Component } from '@angular/core';
import { ApiService } from 'projects/gustavguez/ngx-api/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Inject services
  constructor(
    private apiService: ApiService
  ) { }

  // On component init
  ngOnInit(): void {
    //Set api url
    this.apiService.setApiURL("https://jsonplaceholder.typicode.com");
    this.apiService.changeApiResponseStrategy('root');
  }

  // Custom events
  onClick(): void {
    // Do request
    this.apiService.fetchData("/posts").subscribe(
      (response: any) => {
        //Display response
        console.log(response);
      },
      (error: any) => {
        //Do nothing
      }
    );
  }

}
