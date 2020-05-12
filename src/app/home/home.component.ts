import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish :Dish;
  promotion :Promotion;
  leader :Leader;
  dishErrMess : string;
  promoErrMess : string;
  leaderErrMess : string;

  constructor(private dishService:DishService,
              private promotionService:PromotionService,
              private leaderService:LeaderService,
              @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe(featuredDish=>this.dish = featuredDish,
      errmess => this.dishErrMess = <any>errmess);
    this.promotionService.getFeaturedPromotion().subscribe(promo=>this.promotion = promo,
      errmess => this.promoErrMess = <any>errmess);
    this.leaderService.getFeaturedLeader().subscribe(leader=>this.leader = leader,
      errmess => this.leaderErrMess = <any>errmess);
  }

}
