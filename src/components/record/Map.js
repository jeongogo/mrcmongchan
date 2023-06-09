import React from 'react';
import ViewShot from "react-native-view-shot";
import MapView, { Polyline } from 'react-native-maps';

function Map({initLocation, captureRef, path}) {
  return (
    <ViewShot ref={captureRef} options={{ fileName: "map", format: "jpg", quality: 0.9 }}>
      <MapView
        style={{width: '100%', height: '100%'}}
        initialRegion={{
          latitude: initLocation.latitude,
          longitude: initLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={false}
        zoomEnabled={true}
        // maxZoomLevel={13}
        rotateEnabled={true}
        scrollEnabled={true}
      >
        {(path.length > 1) &&
          <Polyline
            coordinates={path}
            strokeColor='red'
            strokeWidth={2}
          />
        }
      </MapView>
    </ViewShot>
  )
}

export default Map