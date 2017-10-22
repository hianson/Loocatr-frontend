import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios';

const { width, height } = Dimensions.get('window')

export default class MapPage extends Component<{}> {
  constructor() {
  super()

  this.state = {
    region: {
      latitude: null,
      longitude: null,
      latitudeDelta: null,
      longitudeDelta: null
    },
    nearestBathrooms: [
      {
        latitude: 37,
        longitude: -122
      },
      {
        latitude: 38,
        longitude: -122
      },
      {
        latitude: 39,
        longitude: -122
      }
    ]
  }



}



calcDelta(lat, long, accuracy) {
  const oneDegreeofLongitudeInMeters = 111.32;
  const circumference = (40075 / 360)

  const latDelta = accuracy * (1 / (Math.cos(lat) * circumference))
  const lonDelta = (accuracy / oneDegreeofLongitudeInMeters)

  this.setState({
    region: {
      latitude: lat,
      longitude: long,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta
    }
  })
}

getBathrooms(lat, lng) {
  var self = this;
  axios.get(`http://localhost:3000/bathrooms?lat=${lat}&lng=${lng}`)
  .then(function (response) {
    self.setState({ nearestBathrooms: response.data})
  })
  .catch(function (error) {
    console.log(error)
  })
}

componentWillMount() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const long = position.coords.longitude
      const accuracy = position.coords.accuracy
      this.calcDelta(lat, long, accuracy)
      this.getBathrooms(lat, long)
    }
  )
}


marker() {
  return {
    latitude: this.state.region.latitude,
    longitude: this.state.region.longitude
  }
}


render() {
  return (
    <View style={styles.container}>
      {this.state.region.latitude ? <MapView
        style={styles.map}
        initialRegion={this.state.region}
        >
          <MapView.Marker
            coordinate={this.marker()}
            title = "Im here!"
            description = "Home"
          />


          {this.state.nearestBathrooms.map((bathroomData, index) => {
            return (
              <MapView.Marker
                key={index}
                title={bathroomData.location_name}
                coordinate={{longitude: bathroomData.longitude, latitude: bathroomData.latitude}}
              >
              </MapView.Marker>
            )
            console.log('i just rendered something')
          })}

        </MapView> : null }
    </View>
  );
}
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF'
},
map: {
  flex: 1,
  width: width
}
});
