import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
})
export class OrderSuccessComponent implements OnInit, OnDestroy {
  email: string = '';
  private routeSub: Subscription | undefined;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      if (params && params['email']) {
        this.email = params['email'];
      }
    });
  }
  home(): void {
    this.router.navigateByUrl('my-kitchen');
  }
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
