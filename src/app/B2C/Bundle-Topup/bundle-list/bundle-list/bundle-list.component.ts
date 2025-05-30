import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../ApiService/api.service';
import { SpinnerService } from '../../../spinner.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BundleItem, BundleList } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-bundle-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './bundle-list.component.html',
  styleUrl: './bundle-list.component.scss'
})



export class BundleListComponent {

  searchTerm: string = '';
  activeTab : string = 'data';
  dataBundles: BundleItem[] = [];
  voiceBundles: BundleItem[] = [];
  bundleList: BundleItem[] = [];
  constructor(
     @Inject(MAT_DIALOG_DATA) public data: any,
      private apiService: ApiService,
      private spinner: SpinnerService,
      private dialogRef: MatDialogRef<BundleListComponent>
  ) {
   
   }


  ngOnInit() {
    this.bundleList = this.data.dataBundle || []; 
  }

  tabChange() {
    if(this.activeTab === 'data'){
    this.bundleList = this.data.data.dataBundle || [];
    }
    else if(this.activeTab === 'voice'){
      this.bundleList = this.data.data.voiceBundle || [];
    }
  }

  SelectPlan(selectedBundle : BundleItem){
    const price = Number(selectedBundle.price);    
    if(price >= this.data.balance){
      alert(`Your Balance is ${this.data.balance} AFN. Insufficient balance to purchase this bundle. Please topup your wallet or select another bundle.`);
      return;
    }
    else{
          this.dialogRef.close(selectedBundle);
    }
  }

  get filteredBundles(): BundleItem[] {
    if (!this.searchTerm) {
      this.tabChange();
      return this.bundleList;
    }
    else{      
      return this.bundleList.filter(bundle =>{             
        return(bundle.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || bundle.price.includes(this.searchTerm) || bundle.validity.includes(this.searchTerm))

      }
    );
  }

    }


}
