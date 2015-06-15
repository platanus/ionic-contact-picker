(function(){
'use strict';

var CONTACT_PICKER_TPL =
'<ion-modal-view>'
+  '<ion-header-bar align-title="left" class="bar-positive">'
+    '<div class="buttons">'
+      '<button class="button" ng-click="hide()">{{cancelText}}</button>'
+    '</div>'
+    '<h1 class="title">{{title}}</h1>'
+  '</ion-header-bar>'
+  '<ion-content>'
+    '<label class="item item-input">'
+      '<i class="icon ion-search placeholder-icon"></i>'
+      '<input type="search" placeholder="{{placeholder}}" ng-model="searchText">'
+    '</label>'
+    '<ion-list>'
+      '<ion-item ng-click="onSelected(contact)" item-width:"100%" collection-repeat="contact in contacts | filter:{ name: searchText}">'
+        '{{contact.name}}'
+      '</ion-item>'
+    '</ion-list>'
+  '</ion-content>'
+ '</ion-modal-view>';

/**
 * @ngdoc service
 * @name contactPicker
 * @module PlContactPicker
 * @description
 *
 * The Contact Picker service allows programmatically creating and showing a contact picker
 * with a title, a search input and a list of contacts.
 *
 * @usage
 *
 * ```js
 *angular.module('myApp', ['PlContactPicker'])
 *.controller('contactPickerCtrl',function($scope, contactPicker, $timeout) {
 *
 *  // Triggered on a button click, or some other target
 *  $scope.contactPicker = function() {
 *
 *    var contacts =   var contacts = [
 *      { name: "Hodor"},
 *      { name: "Stannis"},
 *      { name: "Jon"},
 *      { name: "Daenerys"},
 *      { name: "Tyrion"},
 *      { name: "Cersei"},
 *      { name: "Sansa"},
 *      { name: "Jorah"},
 *      { name: "Arya"},
 *      { name: "Jamie"}
 *    ];
 *
 *   // An elaborate, custom popup
 *   var myContactPicker = contactPicker.open({
 *     title: 'Do some searchinnn\'!',
 *     searchPlaceholder: 'type here...',
 *     selected: function(contact){
 *       console.log('Selected ',contact);
 *     }
 *   });
 *
 *  $timeout(function(){
 *    myContactPicker.hide();
 *  } ,3000);
 *```
 *
 */


angular
  .module('ionic.utils',[])
  .factory('contactPicker', contactPicker);

function contactPicker(IONIC_BACK_PRIORITY, $timeout, $ionicBody, $ionicPlatform, $ionicBackdrop, $compile, $q, $ionicTemplateLoader, $rootScope, $ionicModal) {

  var self = {};

  return {
    /**
     * Shows the contact picker. If it hasn't been
     * created then it creates it first.
     * @type {function}
     */
    open: show,

    /**
     * Creates contact picker.
     * @type {function}
     */
    create:create,
  };

  /**
   * This is the main method. It is in charge of making decisions based
   * on the options passed.
   *
   * @param  {object}   options
   * @return {promise}  contact picker promise with attached methods
   */
  function createModalPromise(options) {

    // if the call is set then set the local var
    if(options.selected)
      self.onSelectedCallback = options.selected;

    // set the options default values
    options = angular.extend({
      title:'',
      contacts: [],
      searchText:'',
      cancelText:'Cancel',
      placeholder: 'Search'
    }, options);

    /**
     * The ionic modal service accepts a scope option which
     * will be the scope it's tample will use. We create a
     * new scope with no vars then add only the necessary
     * values and pass it to the modal.
     */
    var scope = $rootScope.$new(true);
    scope.contacts = options.contacts;
    scope.title = options.title;
    scope.hide = hide;
    scope.onSelected = onSelected;
    scope.placeholder = options.placeholder;
    scope.searchText = options.searchText;
    scope.cancelText = options.cancelText;

    var modalOptions = {
      animation: options.animation || 'slide-in-up',
      scope: scope
    };

    // create modal with our newly created scope scope
    return options.templateUrl ?
      $ionicModal.fromTemplateUrl(options.templateUrl, modalOptions) :
      $q.when($ionicModal.fromTemplate((options.template || CONTACT_PICKER_TPL), modalOptions));

  }

  // create modal and assign functions to promise
  function createContactPicker(options, cb){
    var modalPromise = createModalPromise(options);

    modalPromise.show = show;
    modalPromise.hide = hide;
    modalPromise.remove = remove;
    modalPromise.isShown = isShown;

    modalPromise.then(function(modal){
      self.modal = modal;
    });

    return modalPromise;
  }

  // called on contact selection
  function onSelected(contact){
    self.onSelectedCallback(contact);
    hide();
  }

  // initialize contact picker
  function create(options){
    self.contactPicker = createContactPicker(options);
    return self.contactPicker;
  }

  function show(options){
    if(!self.contactPicker){
      create(options).then(function(modal){
        modal.show();
      });
    } else {
      self.modal.show();
    }

    return self.contactPicker;
  }

  function hide() {
    self.modal.hide();
  }

  function remove(){
    self.modal.remove();
  }

  function isShown(){
    return self.modal.isShown();
  }

}

// annotate dependencies
contactPicker.$inject = ['IONIC_BACK_PRIORITY', '$timeout', '$ionicBody', '$ionicPlatform', '$ionicBackdrop', '$compile', '$q', '$ionicTemplateLoader', '$rootScope','$ionicModal'];

})();
