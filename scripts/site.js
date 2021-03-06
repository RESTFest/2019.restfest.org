(function($) {
  // Semantic-UI setup
  $(document)
    .ready(function() {

      //open the mobile menu
      $('.toc').click( function(e) {
        e.preventDefault();
        $('.menu.stackable .item').toggleClass('visible')
      })

      // fix menu when passed
      $('.masthead')
        .visibility({
          once: false,
          onBottomPassed: function() {
            $('.fixed.menu').transition('fade in');
          },
          onBottomPassedReverse: function() {
            $('.fixed.menu').transition('fade out');
          }
        })
      ;

      // create sidebar and attach to menu open
      $('.ui.sidebar')
        .sidebar('attach events', '.toc.item')
      ;

      $('.tabular.menu .item').tab();

      // embed videos
      $('.ui.embed').embed();

      // hash fragment tab selection
      $('.ui.menu .item')
        .tab({
          history: true,
          historyType: 'hash'
        })
      ;

      let d = new Date();
      if (location.hash === "" && d.getFullYear() === 2019 && d.getMonth() === 8) {
        let tab = 'wednesday';
        switch (d.getDate()) {
          case 28:
            tab = 'saturday';
            break;
          case 27:
            tab = 'friday';
            break;
          case 26:
            tab = 'thursday';
            break;
          case 25:
          default:
            tab = 'wednesday';
            break;
        }
        console.log('tab', tab);
        $('.ui.menu .item')
          .tab('set state', `/${tab}`);
      }
    })
  ;

  // Leaflet.js goodness added via Vue.js awesome
  new Vue({
    data: {
      features: {}
    },
    created: function() {
      this.loadFeatures();
    },
    watch: {
      features: function() {
        /** app **/
        var map = L.map('map', {
          center: [$('#map').data('lat'), $('#map').data('lng')],
          zoom: 15,
          // interaction options
          scrollWheelZoom: false
        });

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={access_token}', {
          id: 'mapbox.light',
          access_token: 'pk.eyJ1IjoiYmlnYmx1ZWhhdCIsImEiOiJLeGNqSzFvIn0.dQINOF7Ur8PwlaKO8tZPbA',
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
        }).addTo(map);

        L.geoJson(this.features).addTo(map)
          .bindPopup(this.features.properties.title)
          .openPopup();
      }
    },
    methods: {
      loadFeatures: function() {
        this.$http({
          method: 'GET',
          url: 'location.geojson'
        }).then(function(resp) {
          this.$set('features', resp.data)
        }).catch(console.log.bind(console));
      }
    }
  });
})(jQuery);
