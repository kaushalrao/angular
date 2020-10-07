import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderDetails } from '../_models/OrderDetails';
import { CookieService } from 'ngx-cookie';
import { ProductDetails } from '../_models/ProductDetails';
import { UpdateOrder } from '../_models/UpdateOrder';



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  findAllPlacedOrder(vendor_id: string, status: string) {
    return this.http.get<OrderDetails[]>('http://localhost:8000/dashboard/placed_orders/?vendor_id=' + vendor_id + '&status=' + status, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + this.cookieService.get('auth-token'))
    });
  }

  findAllItemPerOrder(inventory_number: string) {
    return this.http.get<ProductDetails[]>('http://localhost:8000/dashboard/order_products/?order_id=' + inventory_number, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + this.cookieService.get('auth-token'))
    });
  }

  updateOrderStatus(orderDetails: UpdateOrder) {
    return this.http.put<any>('http://localhost:8000/dashboard/update_order_status/', orderDetails, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + this.cookieService.get('auth-token'))
    });
  }

  PhoneNumberList() {
    return this.http.get<any>('http://127.0.0.1:8000/dashboard/unique_contacts/', {
      headers: new HttpHeaders().set('Authorization', 'Token ' + this.cookieService.get('auth-token'))
    });
  }

}