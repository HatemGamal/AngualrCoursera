import { Component, OnInit, Input, ViewChild, Inject  } from '@angular/core';
import { Dish } from '../shared/dish';
import {Comment} from '../shared/comment';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  @Input()
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  commentForm: FormGroup;
  comment: Comment;

  errMess: string;
  dishcopy: Dish;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.',
      'maxlength':     'Author cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
      'minlength':     'comment must be at least 2 characters long.',
      'maxlength':     'comment cannot be more than 100 characters long.'
    }
  };


  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
     }

  // ngOnInit() {
  //   const id = this.route.snapshot.params['id'];
  //   this.dishservice.getDish(id).subscribe(dish=>this.dish = dish);
  // }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {
                                        this.visibility='hidden';
                                        return this.dishService.getDish(params['id']);
                                      }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility='shown';},
        errmess => this.errMess = <any>errmess );
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating : '5',
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
      date:''
    });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();

  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.commentForm.patchValue({"date": new Date().toISOString()});
    this.comment = this.commentForm.value;

    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy).subscribe(dish => {
      this.dish = dish; this.dishcopy = dish;
    },
    errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });

    console.log(this.comment);

    this.commentForm.reset({
      author: '',
      rating : '5',
      comment:'',
      date:''
    });

  }

}
