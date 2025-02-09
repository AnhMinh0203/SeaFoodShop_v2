import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-order-management',
  imports: [
    TabsModule,
    InputGroupModule,
    InputGroupAddonModule,
    CardModule,
    FormsModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent {
  value: any;
  searchText: string = '';
}
