// Import the necessary dependencies
import { Layout } from 'react-native-rapi-ui';
import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Modal, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';

export default function ({ navigation }) {
  const [markers, setMarkers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [surface, setSurface] = useState("");
  const [description, setDescription] = useState("");
  const [mapKey, setMapKey] = useState("");
  const [region, setRegion] = useState(null);
  const [addMarker, setAddMarker] = useState(false);
  const [typeBien, setTypeBien] = useState("");
  const [typeOperation, setTypeOperation] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch announcements from the backend when the component mounts
    fetchAnnouncements();
    // Request location permissions and get current position
    getLocation();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://localhost:3002/annonce");
      const data = await response.json();
      setMarkers(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const handleMapPress = (event) => {
    if (!addMarker) {
      return;
    }
    setVisible(true);
    const newMarker = {
      coordinate: event.nativeEvent.coordinate,
      type: "",
    };
    setMarkers([...markers, newMarker]);
    setMapKey(Math.random().toString());
  };

  const handleMarkerPress = (marker) => {
    console.log(marker);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('PrixBien', price);
      formData.append('Surface_Bien', surface);
      formData.append('Description', description);
      formData.append('type_Bien', typeBien);
      formData.append('type_operation', typeOperation);
      formData.append('coordinate', JSON.stringify(markers[markers.length - 1].coordinate));
      formData.append('photo', image);

      // Use the appropriate endpoint for creating an announcement
      const response = await fetch("http://localhost:3002/annonce", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Announcement created successfully");
        fetchAnnouncements(); // Fetch updated list of announcements
        setVisible(false);
        setPrice('');
        setSurface('');
        setDescription('');
        setTypeBien('');
        setTypeOperation('');
        setImage(null);
      } else {
        console.error("Failed to create announcement");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setPrice("");
    setSurface("");
    setDescription("");
    setTypeBien("");
    setTypeOperation("");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
              style={[styles.input, { height: 100 }]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[styles.button, { width: '53%' }]}
              onPress={pickImage}
            >
              <Text style={styles.buttonText}>Choisir une image</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
            )}

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
                onPress={handleCancel}
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