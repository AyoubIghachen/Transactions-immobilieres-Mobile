import { Layout } from 'react-native-rapi-ui';
import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Modal, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

function LandingPage({ onAddAnnoncePress, onVisualiserAnnoncesPress, onAddDemandePress, onVisualiserMesAnnoncesPress }) {
	return (
		<View style={styles.landingContainer}>
			<FontAwesome name="building" size={100} color="black" style={styles.logo} />
			<Text style={styles.landingText}>Welcome to the Immobilier App!</Text>
			<TouchableOpacity style={styles.button} onPress={onAddAnnoncePress}>
				<FontAwesome name="plus" size={24} color="white" />
				<Text style={styles.buttonText}>Ajouter une annonce</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={onVisualiserAnnoncesPress}>
				<FontAwesome name="eye" size={24} color="white" />
				<Text style={styles.buttonText}>Visualiser les annonces</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={onAddDemandePress}>
				<FontAwesome name="plus" size={24} color="white" />
				<Text style={styles.buttonText}>Ajouter une demande</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={onVisualiserMesAnnoncesPress}>
				<FontAwesome name="eye" size={24} color="white" />
				<Text style={styles.buttonText}>Visualiser mes demandes </Text>
			</TouchableOpacity>
		</View>
	);
}


export default function ({ navigation }) {
	const [markers, setMarkers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [surface, setSurface] = useState("");
  const [description, setDescription] = useState("");
  const [mapKey, setMapKey] = useState("");
  const [region, setRegion] = useState(null);
  const [addMarker, setAddMarker] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [typeBien, setTypeBien] = useState("");
  const [typeOperation, setTypeOperation] = useState("");

  useEffect(() => {
    fetch("http://172.16.12.157:3000/markers")
      .then((response) => response.json())
      .then((json) => setMarkers(json))
      .catch((error) => console.error(error));

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, [,]);

  const handleMapPress = (event) => {
    if (!addMarker) {
      return;
    }
    setVisible(true);
    const newMarker = {
      coordinate: event.nativeEvent.coordinate,
      key: markers.length.toString(),
      type: "",
    };
    setMarkers([...markers, newMarker]);
    setMapKey(Math.random().toString());
  };

  const handleMarkerPress = (marker) => {
    console.log(marker);
  };
  const handleSubmit = () => {
    const data = {
      price,
      surface,
      description,
      typeBien,
      typeOperation,
      coordinate: markers[markers.length - 1].coordinate,
    };
    saveMarker(data);
    setVisible(false);
    setPrice("");
    setSurface("");
    setDescription("");
    setTypeBien("");
    setTypeOperation("");
  };

  const handleCancel = () => {
    setVisible(false);
    setPrice("");
    setSurface("");
    setDescription("");
    setTypeBien("");
    setTypeOperation("");
  };

  const saveMarker = (data) => {
    fetch("http://172.16.12.157:3000/markers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("Server response:", response);
        return response.json();
      })
      .then((json) => {
        const newMarker = {
          id: json.id,
          price: json.price,
          surface: json.surface,
          description: json.description,
          typeBien: json.typeBien,
          typeOperation: json.typeOperation,
          coordinate: json.coordinate,
        };
        setMarkers([...markers, newMarker]);
        setMapKey(Math.random().toString());
      })
      .catch((error) => console.error(error));
  };

  const handleAddAnnoncePress = () => {
    setShowLandingPage(false);
  };

  const handleVisualiserAnnoncesPress = () => {
    // TODO: Implement visualiser les annonces functionality
  };

  const handleAddDemandePress = () => {
    // TODO: Implement ajouter une demande functionality
  };

  const handleVisualiserMesAnnoncesPress = () => {
    // TODO: Implement visualiser mes annonces functionality
  };

  const handleGoToLandingPage = () => {
    setShowLandingPage(true);
  };

  if (showLandingPage) {
    return (
      <LandingPage
        onAddAnnoncePress={handleAddAnnoncePress}
        onVisualiserAnnoncesPress={handleVisualiserAnnoncesPress}
        onAddDemandePress={handleAddDemandePress}
        onVisualiserMesAnnoncesPress={handleVisualiserMesAnnoncesPress}
      />
    );
  }




	return (
		<Layout>
			<View style={styles.container}>
      <MapView
        key={mapKey}
        style={styles.map}
        onPress={handleMapPress}
        region={region}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            pinColor={marker.type === "sell" ? "red" : "blue"}
            onPress={() => handleMarkerPress(marker)}
          >
            <Callout>
              <View>
                <Text>Price: {marker.price}</Text>
                <Text>Surface: {marker.surface}</Text>
                <Text>Description: {marker.description}</Text>
                <Text>Type de bien: {marker.typeBien}</Text>
                <Text>Type d'opération: {marker.typeOperation}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { width: "45%" }]}
          onPress={() => setAddMarker(!addMarker)}
        >
          <FontAwesome
            name={addMarker ? "times" : "plus"}
            size={24}
            color="white"
          />
          <Text style={styles.buttonText}>
            {addMarker ? "Annuler" : "Localiser"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { width: "45%" }]}
          onPress={handleGoToLandingPage}
        >
          <FontAwesome name="arrow-left" size={24} color="white" />
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={visible} animationType="slide">
        <View style={[styles.form, { flex: 1 }]}>
          <TextInput
            style={styles.input}
            placeholder="Prix"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Surface_bien"
            value={surface}
            onChangeText={setSurface}
          />
          <Picker
            selectedValue={typeBien}
            onValueChange={(itemValue) => setTypeBien(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Appartement" value="appartement" />
            <Picker.Item label="Terrain" value="terrain" />
          </Picker>
          <Picker
            selectedValue={typeOperation}
            onValueChange={(itemValue) => setTypeOperation(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Vente" value="vente" />
            <Picker.Item label="Louer" value="louer" />
          </Picker>
          <TextInput
            style={[styles.input, { height: 100 }]} // Increase height as needed
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4} // Adjust as needed
          />
          <View
            style={[styles.buttonContainer, { justifyContent: "flex-end" }]}
          >
            <TouchableOpacity
              style={[styles.button, { width: "45%" }]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Envoyer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { width: "45%" }]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
		</Layout>
	);
}



const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		flex: 1,
	},
	form: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: 'gray',
		padding: 10,
		marginVertical: 10,
		width: '100%',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginVertical: 10,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'green',
		padding: 10,
		margin: 15,
		borderRadius: 5,
	},
	buttonText: {
		color: 'white',
		marginLeft: 10,
		fontSize: 18,
		fontWeight: 'bold',
	},
	landingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'lightgreen',
	},
	landingText: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	logo: {
		marginBottom: 20,
	},
});