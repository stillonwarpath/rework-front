import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFrameMessagesComponent } from './top-frame-messages.component';

describe('TopFrameMessagesComponent', () => {
  let component: TopFrameMessagesComponent;
  let fixture: ComponentFixture<TopFrameMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopFrameMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFrameMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
