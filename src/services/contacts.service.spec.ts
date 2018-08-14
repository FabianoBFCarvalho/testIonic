import { TestBed, inject }     from '@angular/core/testing';
import { ContactsService }     from './contacts.service';
import PouchDB                          from 'pouchdb';

class PouchDBMock {
    plugin() {
        return PouchDBMock;
    }

    allDocs(any) {
        return new Promise((resolve: Function) => {
			resolve([
                {doc: 
                    {
                        action: 'name',
                        _id: '123',
                        code: '2',
                        db_id: '2',
                        type: 'pessoa',
                        inactive: false,
                        favorite: true,
                        name: 'aaa'
                    }
                }
            ]);
		});
    }

    post(any) {
        return new Promise((resolve: Function) => {
			resolve();
		});
    }

    put(any) {
        return new Promise((resolve: Function) => {
			resolve();
		});
    }

    get(any) {
        return new Promise((resolve: Function) => {
			resolve({_id: '111', _rev: '222', code: '1'});
		});
    }
}

describe('ContactsService', () => {

    let instance: ContactsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ContactsService
            ]
        });
    });

    beforeEach(
        inject([ContactsService], (_contacts: ContactsService) => {
            instance = _contacts;
        })
    );

    it('initialize()', () => {
        expect(instance).toBeDefined();
    });

    it('insertPouch', () => {
        spyOn(instance, 'getPouchDatabase').and.returnValue(new PouchDBMock());
        instance.insertContactPouchDB({code: '123', type: 'person', fullname: 'Fabiano'}, 'contact').subscribe(
            response => expect(response['code']).toBe(0)
        );
    });

    it('getPouch', () => {
        spyOn(instance, 'getPouchDatabase').and.returnValue(new PouchDBMock());
        instance.getContactsPouchDB('person').subscribe(
            response => expect(response.name).toBe('aaa')
        );
    });

    it('get em um unico contato', () => {
        spyOn(instance, 'getPouchDatabase').and.returnValue(new PouchDBMock());
        instance.getContact('0', '123', '').subscribe(
            result => expect(result.code).toBe('1')
        );
    });

    it('Update Contact PouchDB', () => {
        spyOn(instance, 'getPouchDatabase').and.returnValue(new PouchDBMock());
        instance.updateContactPouchDB({}, 'person').subscribe(
            response => expect(response['action']).toBe('PUT')
        );
    });

    it('Deleted Contact PouchDB', () => {
        spyOn(instance, 'getPouchDatabase').and.returnValue(new PouchDBMock());
        instance.deleteContactPouchDB( {}, 'person').subscribe(
            response => expect(response).toBe('contact_deleted')
        );
    });

});