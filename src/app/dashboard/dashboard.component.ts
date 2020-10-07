import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OrderDetails } from '../_models/OrderDetails';
import { ProductDetails } from '../_models/ProductDetails';
import { CookieService } from 'ngx-cookie';
import { User } from '../_models/User';
import { OrderService } from '../_services/order.service';
import { CompleterService, CompleterData } from 'ng2-completer';
import { first } from 'rxjs/operators';
import { NotificationService } from '../_services/notification.service';
import { UpdateOrder } from '../_models/UpdateOrder';
import { Router } from '@angular/router';
import * as Chartist from 'chartist';
import { UniqueContacts } from '../_models/UniqueContacts';
import { ModalManager } from 'ngb-modal';
import { Observable, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  protected searchStr: string;
  private updateSubscription: Subscription;
  userInfo: User = new User();
  updateOrderDetails: UpdateOrder = new UpdateOrder();
  orderDetails: OrderDetails = new OrderDetails();
  pendingOrderDetails: OrderDetails[];
  approvedOrderDetails: OrderDetails[];
  deliveredOrderDetails: OrderDetails[];
  productDetails1: ProductDetails[];
  phoneNumberList: UniqueContacts = new UniqueContacts();
  phoneNumber: number;
  status: boolean;
  protected dataService: CompleterData;


  @ViewChild('myModal') myModal;
  private modalRef;
  constructor(
    public route: Router,
    private cookieService: CookieService,
    private notifyService: NotificationService,
    private orderService: OrderService,
    private modalService: ModalManager
  ) { }

  openModal(productNumber, Status) {
    this.modalRef = this.modalService.open(this.myModal, {
      size: "md",
      modalClass: 'mymodal',
      hideCloseButton: false,
      centered: false,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: true,
      backdropClass: "modal-backdrop"
    })
    if (Status === 'pla') {
      this.status = true;
    }
    else {
      this.status = false;
    }
    this.orderService.findAllItemPerOrder(productNumber)
      .pipe(first())
      .subscribe(
        data => {
          this.productDetails1 = data;
        },
        error => {
          this.notifyService.showError("Failed to fetch pending order List", "Pending Order List");
        });
  }
  closeModal() {
    this.modalService.close(this.modalRef);
  }
  ngOnInit() {
    this.userInfo = JSON.parse(this.cookieService.get('user-data'));
    this.updateSubscription = interval(50000).subscribe(
      (val) => {
      });
    this.fetchPhoneNumber();
    this.fetchPendingRequest();
    this.fetchApprovedRequest();
    this.fetchDeliveredRequest();

  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.orderDetails = JSON.parse(JSON.stringify(event.previousContainer.data[event.previousIndex]));
      if (event.container.element.nativeElement.id === 'Approved') {
        this.updateOrderDetails.order_id = this.orderDetails.order_id;
        this.updateOrderDetails.order_status = 'pro'
        this.orderService.updateOrderStatus(this.updateOrderDetails)
          .pipe(first())
          .subscribe(
            data => {
              this.notifyService.showSuccess("Status of " + this.orderDetails.order_id + " Updated to Approved", "Order Status");
              this.ngOnInit();
            },
            error => {
              this.notifyService.showError("Failed to update Order Status of " + this.orderDetails.order_id, "Order Status");
            });
      }
      else if (event.container.element.nativeElement.id === 'Delivered') {
        this.updateOrderDetails.order_id = this.orderDetails.order_id;
        this.updateOrderDetails.order_status = 'del'
        this.orderService.updateOrderStatus(this.updateOrderDetails)
          .pipe(first())
          .subscribe(
            data => {
              this.notifyService.showSuccess("Status of " + this.orderDetails.order_id + " Updated to Delivered", "Order Status");
              this.ngOnInit();
            },
            error => {
              this.notifyService.showError("Failed to update Order Status of " + this.orderDetails.order_id, "Order Status");
            });
      }

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  fetchPhoneNumber() {
    this.orderService.PhoneNumberList()
      .pipe(first())
      .subscribe(
        data => {
          Object.assign(this.phoneNumberList, data);
        },
        error => {
          this.notifyService.showError("Failed to fetch pending order List", "Pending Order List");
        });
  }
  fetchProductDetails(productNumber) {
    this.orderService.findAllItemPerOrder(productNumber)
      .pipe(first())
      .subscribe(
        data => {
          this.productDetails1 = data;
        },
        error => {
          this.notifyService.showError("Failed to fetch pending order List", "Pending Order List");
        });
  }

  fetchPendingRequest() {
    if (this.phoneNumber) {
      this.pendingOrderDetails = this.pendingOrderDetails.filter(x => x.customer_contact == this.phoneNumber);
    }
    else {
      this.orderService.findAllPlacedOrder(this.userInfo.contact, 'pla')
        .pipe(first())
        .subscribe(
          data => {
            this.pendingOrderDetails = data;
          },
          error => {
            this.notifyService.showError("Failed to fetch pending order List", "Pending Order List");
          });
    }
  }
  fetchApprovedRequest() {
    if (this.phoneNumber) {
      this.approvedOrderDetails = this.approvedOrderDetails.filter(x => x.customer_contact == this.phoneNumber);
    }
    else {
      this.orderService.findAllPlacedOrder(this.userInfo.contact, 'pro')
        .pipe(first())
        .subscribe(
          data => {
            this.approvedOrderDetails = data;
          },
          error => {
            this.notifyService.showError("Failed to fetch approved order List", "Approved Order List");
          });
    }
  }
  fetchDeliveredRequest() {

    if (this.phoneNumber) {
      this.deliveredOrderDetails = this.deliveredOrderDetails.filter(x => x.customer_contact == this.phoneNumber);
    }
    else {
      this.orderService.findAllPlacedOrder(this.userInfo.contact, 'del')
        .pipe(first())
        .subscribe(
          data => {
            this.deliveredOrderDetails = data;
          },
          error => {
            this.notifyService.showError("Failed to fetch delivered order List", "Delivered Order List");
          });
    }
  }

  onSubmit(phoneNumber) {
    this.phoneNumber = phoneNumber;
    this.fetchPendingRequest();
    this.fetchApprovedRequest();
    this.fetchDeliveredRequest();
  }
  onClear() {
    this.phoneNumber = null;
    this.ngOnInit();
  }

}
