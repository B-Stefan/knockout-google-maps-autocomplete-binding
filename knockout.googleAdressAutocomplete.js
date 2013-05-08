define(['knockout', 'jquery', 'gmaps'], function (ko, $, gmaps) {

    ko.bindingHandlers.googleAdressAutocomplete = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var self = element
            var allBindings = allBindingsAccessor()
            var position = new gmaps.maps.LatLng(allBindings.lat(), allBindings.lng());

            /**
             * Define geocode function for update and init
             */
            self.geocode = ko.computed({
                write: function (pos) {
                    if (allBindings.lat() == 0 || allBindings.lng() == 0) {
                        return
                    }
                    if (allBindings.lat() == self._oldLat && allBindings.lng() == self._oldLng) {
                        return
                    }
                    if (allBindings.map) {
                        viewport = allBindings.map
                    }
                    self._geocoder = new gmaps.maps.Geocoder();
                    self._geocoder.geocode({'latLng': pos, region: 'de'}, function (results, status) {
                        if (status == gmaps.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                result = results[0]

                                $(self).val(result.formatted_address)

                                self._oldPlace = result.formatted_address
                                allBindings.value(result.formatted_address)
                            } else {
                                alert("'No results found'")
                                window.dialog({state: false, message: 'No results found'});
                            }
                        } else {
                            alert('Geocoder failed due to: ' + status);
                        }
                    });


                },
                read: function () {
                    return null
                }
            }).extend({throttle: 1000})

            if (allBindings.lat() != 0 && allBindings.lng() != 0 && $(self).val() == '') {
                self.geocode(position)
            }

            /**
             * Add autocomplete support for the input
             * @type {gmaps.maps.places.Autocomplete}
             * @private
             */
            self._autocomplete = new gmaps.maps.places.Autocomplete(element);
            if (allBindings.map) {
                self._autocomplete.bindTo('bounds', allBindings.map);
            }
            gmaps.maps.event.addListener(self._autocomplete, 'place_changed', function () {

                var place = self._autocomplete.getPlace();
                if (!place.geometry) {
                    // Inform the user that the place was not found and return.
                    window.dilog({state: false, message: 'Place not found'})
                    return;
                }
                if (allBindings.map) {
                    // If the place has a geometry, then present it on a map.
                    if (place.geometry.viewport) {
                        allBindings.map.fitBounds(place.geometry.viewport);
                    }
                    else {
                        allBindings.map.setCenter(place.geometry.location);
                        allBindings.map.setZoom(15);
                    }
                }
                //update model position
                self._oldLat = place.geometry.location.lat()
                self._oldLng = place.geometry.location.lng()
                allBindings.lat(place.geometry.location.lat())
                allBindings.lng(place.geometry.location.lng())

                self._oldPlace = place.formatted_address
                allBindings.value(place.formatted_address)

            })
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var self = element
            if (valueAccessor().allowInvalidPlaceInput == true) {

                currentValue = ko.utils.unwrapObservable(allBindingsAccessor()).value()
                try{

                    autocompleteValue = self._oldPlace

                }
                catch(err){
                    return
                }
                console.log(currentValue + ' - ' +  autocompleteValue)
                    if (currentValue != autocompleteValue ){
                        console.log("yeeea")
                        return
                    }

            }
            valueUnwrapped = ko.utils.unwrapObservable(allBindingsAccessor())
            var position = new gmaps.maps.LatLng(valueUnwrapped.lat(), valueUnwrapped.lng());
            self.geocode(position)


        }

    }


})