import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md/lib/free/modals/modal.directive';
import { ToastrService } from 'ngx-toastr';

import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-modal-business-lead-generation',
  templateUrl: './modal-business-lead-generation.component.html',
  styleUrls: ['./modal-business-lead-generation.component.css']
})
export class ModalBusinessLeadGenerationComponent implements OnInit, AfterViewInit {

  @ViewChild('downloadPDFModal', { static: true }) downloadPDFModal: ModalDirective;
  businessLeadGenerationForm: FormGroup;


  constructor( private businessService: BusinessService,
               private toastService: ToastrService ) { }

  ngOnInit(): void {

    this.businessLeadGenerationForm = new FormGroup({
      companyEmail: new FormControl(null, [Validators.required, Validators.email]),
      companyName: new FormControl(null, Validators.required)
    });
  }

    
  ngAfterViewInit(): void {
   
    this.downloadPDFModal.show();

  }

  get companyEmail() {
    return this.businessLeadGenerationForm.get('companyEmail');
  }

  get companyName( ) {
    return this.businessLeadGenerationForm.get('companyName');
  }

  async getBusinessLeadGenerationPDF() {

    if ( this.businessLeadGenerationForm.invalid ) {
       return;
    }

    try {

      await this.businessService.createLead( this.companyEmail.value, this.companyName.value  );
      this.downloadPDFModal.hide();
      this.toastService.success('Un enlace para que descargues la guía gratis ha sido enviada a tu email.','',{
        timeOut: 7000,
        positionClass: 'toast-top-center' 
      });

    } catch ( err ) {

      //TODO: Mostrar toast con error

    }




  }


}
