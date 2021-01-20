import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusinessLeadGenerationComponent } from './modal-business-lead-generation.component';

describe('ModalBusinessLeadGenerationComponent', () => {
  let component: ModalBusinessLeadGenerationComponent;
  let fixture: ComponentFixture<ModalBusinessLeadGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusinessLeadGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBusinessLeadGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
