(function(){
'use strict';

angular
  .module('platanus.phoneContacts',[])
  .service('PhoneContacts', PhoneContacts);


// TODO: add lodash dependecy
// TODO: add function descriptions
// TODO: add PhoneContacts as a bower dependency?
function PhoneContacts(){

  var connectCallback = angular.noop
  , contactsByName = []
  , contactsByEmail = {}
  , access = false
  , options = {};

  return {
    connect: connect,
    getContacts: getContacts,
    getContactByEmail: getContactByEmail,
    hasAccess: hasAccess
  };

  function connect(options,callback){
    var fields = ["displayName", "name", "nickname", "emails", "photos"];
    var config = {
      multiple: true
    };

    options = angular.extend({}, options);

    connectCallback = callback;
    navigator.contacts.find(fields, onSearchSuccess, onSearchError, config);
  }

  function getContacts() {
    return contactsByName;
  }

  function getContactByEmail(email){
    return contactsByEmail[email];
  }

  function hasAccess(){
    return access;
  }

  function onSearchError(err){
    connectCallback(access,err);
  }

  function onSearchSuccess(_contacts){
    access = true;

    // Reset the contacts array
    contactsByName.length = 0;

    // TODO: this could be done with an each (?)
    // Normalize the contacts and push them tho the service variable
    // Remove excluded contacts
    for(var _contact, i = 0; (_contact = _contacts[i]); i++){
      // The normalized contact
      var contact = {};

      // The normalized contact name
      // IOS always return displayName as null
      var contactName = _contact.displayName || _contact.name.formatted;

      // The filter pass condition
      if(contactName && _contact.emails && _contact.emails.length > 0){
        contact.id = _contact.id;

        // Set the displayName if null
        contact.name = contactName;

        // The photo url
        contact.photo = (_contact.photos && _.first(_contact.photos)) ? _contact.photos[0].value : (options.contactPhotoFallback || null);

        // TODO: add explanation
        // The emails
        contact.emails = _.chain(_contact.emails)
                          .map('value')
                          .uniq()
                          .value();

        // Push the contact to the array
        contactsByName.push(contact);
      }
    } // end of for

    // TODO: refactor
    // Sort contacts by display name
    contactsByName.sort(function compare(a,b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    });

    _.each(contactsByName, function(contact) {
      _.each(contact.emails, function(email) {
        contactsByEmail[email] = contact;
      });
    });

    connectCallback(contactsByName);

  } // end of onSearchSuccess
}

})();
