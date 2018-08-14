import { TestBed, ComponentFixture, async }         from '@angular/core/testing';
import { Http }                                     from '@angular/http';
import { IonicModule }                              from 'ionic-angular';
import { MyApp }                                   from './app.component';


let component: MyApp;
let fixture: ComponentFixture<MyApp> = null;

describe('AppComponent', () => {
    
    beforeEach(async(() => {
 
        TestBed.configureTestingModule({ 
            declarations: [
                MyApp,
            ],
            imports: [
				IonicModule.forRoot(MyApp)
            ]
        }).compileComponents();
         
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyApp);
        component    = fixture.componentInstance; 
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    it('count notifications and emails', () => {
    });

});
