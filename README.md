Platanus Ionic Contact Picker
============

Contact picker service.

## Platanus Ionic Contact Picker is no longer maintained.

- We will leave the Issues open as a discussion forum only.
- We do not guarantee a response from us in the Issues.
- We are no longer accepting pull requests.

## Installation

You can install this library via Bower.

```shell
$ bower install platanus-ionic-contact-picker
```

Finally, include the JS file in your HTML and the `platanus.contactPicker` dependency in your Angular app.

```javascript
angular.module('yourApp', ['PlContactPicker']);
```

## How to use

```javascript

// An elaborate, custom popup
var myContactPicker = contactPicker.open({
  title: 'Do some searchinnn\'!',
  searchPlaceholder: 'type here...',
  selected: function(contact){
    console.log('Selected ',contact);
  },
  contacts:[{ name:'Jhon Snow' }]
});

$timeout(function(){
  myContactPicker.hide();
} ,3000);

```

Note that if no contacts are passed the service attempts to connect
to the phone using ngCordova's contact plugin.

## Default look
![](http://i.imgur.com/HAb5z8A.gif)

## Roadmap

* Support for multiple contact selection
* Integrate Cordova Contacts Plugin

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Credits

Thank you [contributors](https://github.com/platanus/ionic-contact-picker/graphs/contributors)!

<img src="http://platan.us/gravatar_with_text.png" alt="Platanus" width="250"/>

ionic-contact-picker is maintained by [platanus](http://platan.us).

## License

Ionic Contact Picker is © 2015 platanus, spa. It is free software and may be redistributed under the terms specified in the LICENSE file.
