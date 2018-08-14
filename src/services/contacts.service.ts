import { Injectable }              	    from '@angular/core';
import { Observable }              	    from 'rxjs/Observable';
import PouchDB                          from 'pouchdb';
import PouchFind                        from 'pouchdb-find';
import 'rxjs/Rx';

@Injectable()
export class ContactsService {

    private db = require('pouchdb');

    constructor( ) {
        PouchDB.plugin(PouchFind);
    }
 
    getContact(id: string, code: string, contactType: string, database?: string): Observable<any> {
        return new Observable<any>(observer => {
            let pouchDatabase = this.getPouchDatabase(contactType); 
            if (id)
                pouchDatabase.get(id).then(doc => {
                    observer.next(doc);
                })
            else
                pouchDatabase.find({
                    selector: {code: {$eq: code}}
                }).then(result => {
                    observer.next(result);
                }).catch(error => observer.error('contact_get_error'));
            
        });
    }

    getContactsPouchDB(contact_type: string): Observable<any> {
        let database = this.getPouchDatabase(contact_type);
		return Observable.fromPromise(
			database.allDocs({ include_docs: true }).then(docs => {
				return docs.rows.filter(row => row.doc.action != 'DELETE')
					.map(row => {
                        let name: string;
                        let type: string;
                        if (row.doc.fullname) {
                            name = row.doc.fullname;
                            type = 'person';
                        }
                        else {
                            name = row.doc.name;
                            type = 'organization';
                        }
                        return {
                            _id: row.doc._id,
                            code: row.doc.code,
                            db_id: row.doc.db_id,
                            type: type,
                            inactive: row.doc.inactive,
                            favorite: row.doc.favorite,
                            name: name,
                            profile_image_url: row.doc.profile_image_url,
                            phones:  row.doc.phone,
                            properties: row.doc.properties,
                            tags: row.doc.tags
                        }
                    });
			})
        );
    }

     insertContactPouchDB(contact: any, contactType: string): Observable<Object> {
        return new Observable<Object>(observer => {
            let database = this.getPouchDatabase(contactType);
            (contactType == 'lead') ? contact.tags = ['lead'] : contact.tags = ['contacts']; 
            contact.type = contactType;
            delete contact._id;
            contact.action = 'POST';
            database.post(contact).then(() => {                
                observer.next({code: 0});
                observer.complete();
            }).catch((erro) => {
                observer.error('contact_insert_error');
                observer.complete();
            });
        });
    }

     updateContactPouchDB(contact: any, contactType: string): Observable<Object> {
        return new Observable<Object>(observer => {
            let database = this.getPouchDatabase(contactType);
            console.log('data');
            console.log(database);
            
            contact.type = contactType;
            database.get(contact._id).then(doc => {                
                contact['_rev'] = doc._rev;
                contact['code'] = doc.code;
                database.put(contact).then(a => {
                    observer.next(contact);
                    observer.complete();
                }).catch((error) => {
                    observer.error('contact_update_error');
                    observer.complete();
                });
            });
        });
    }

     deleteContactPouchDB(contact: any, contactType: string): Observable<string> {
        return new Observable<string>(observer => {
            let database = this.getPouchDatabase(contactType);
            contact.type = contactType;
            database.get(contact._id).then(doc => {                
                contact['_rev'] = doc._rev;
                contact.code = doc.code;
                contact.action = 'DELETE';
                database.put(contact).then(success => {
                    observer.next('contact_deleted');
                    observer.complete();
                }).catch(erro => {
                    observer.next('contact_delete_error');
                    observer.complete();
                });
            });
        });
    }

     getPouchDatabase(contact_type: string) {
        this.db = new PouchDB('contacts');
        return this.db;
    }
}
