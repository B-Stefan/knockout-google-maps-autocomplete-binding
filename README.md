Google Maps Knockout-Binding 
================================
This custom binding geocode a position to an formatet adress. 


Options 
-------------------------
* allowInvalidPlaceInput: true => Allow the user to enter a custom name that is no place 

Example
-------------------------

```html

<input data-bind="	googleAdressAutocomplete:{},
			map: map, 
			lat: lat,
			lng: lng, 
			value: description" />
    

```