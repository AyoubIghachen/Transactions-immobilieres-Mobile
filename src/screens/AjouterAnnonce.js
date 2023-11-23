import { Layout } from 'react-native-rapi-ui';
import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Modal, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native';
import { firebase } from '../config';


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
  const [image, setImage] = useState("");
  const [intermidiaireID, setIntermidiaireID] = useState("");
  const [citoyenId, setCitoyenId] = useState("");
  const [date_annnonce, setDate_annnonce] = useState(new Date());
  const [status, setStatus] = useState("");
  const [motif, setMotif] = useState("");
  const [delai, setDelai] = useState(0);
  const [Declaree, setDeclaree] = useState("");
  const [AnnonceId, setAnnonceId] = useState("");

  useEffect(() => {
    fetchAnnouncements();
    getLocation();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://192.168.43.59:3002/annonce");
      let data = await response.json();

      // Adjust the structure of the markers
      data = data.map(marker => ({
        coordinate: {
          latitude: marker.latitude,
          longitude: marker.longitude,
        },
        // Copy other properties of the marker
        ...marker,
      }));

      setMarkers(data);
    } catch (error) {
      console.error(error);
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

    console.log(event.nativeEvent.coordinate); // Add this line

    const newMarker = {
      coordinate: {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
      },
      //coordinate: event.nativeEvent.coordinate,
      type: "",
    };
    setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
    //setMarkers([...markers, newMarker]);
    setMapKey(Math.random().toString());
  };



  const handleMarkerPress = (marker) => {
    console.log(marker);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.43.59:3002/annonce", { // replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          intermidiaireID,
          citoyenId,
          date_annnonce,
          status,
          motif,
          delai,
          photo: image,
          type_operation: typeOperation,
          type_Bien: typeBien,
          surface_Bien: surface,
          prixBien: price,
          description: description,
          Declaree,
          AnnonceId,
          latitude: region.latitude,
          longitude: region.longitude,
        }),
      });
      
      if (response.ok) {
        console.log('Announcement added successfully');
        // Create a new marker
        const newMarker = {
          Declaree,
          AnnonceId,
          latitude: region.latitude,
          longitude: region.longitude,
        };
        // Add the new marker to the markers
        setMarkers([...markers, newMarker]);
        handleCancel(); // reset the form fields and close the modal
      } else {
        console.error('Error adding announcement:', response.status, response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIntermidiaireID("");
    setCitoyenId("");
    setStatus("");
    setMotif("");
    setDelai(0);
    setImage("");
    setTypeOperation("");
    setTypeBien("");
    setSurface("");
    setPrice("");
    setDescription("");
    setDeclaree("");
    setAnnonceId("");
    setVisible(false);
  };



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const ref = firebase.storage().ref().child(new Date().getTime().toString());
      const snapshot = await ref.put(blob);

      const url = await snapshot.ref.getDownloadURL();
      setImage(url);
    }
  };

  //console.log(markers);

  return (
    <Layout>
      <MapView
        key={mapKey}
        style={styles.map}
        onPress={handleMapPress}
        region={region}
      >
        {markers.map((marker, index) => {
          if (marker.coordinate && marker.coordinate.latitude && marker.coordinate.longitude) {
            return (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                pinColor={marker.type === "sell" ? "red" : "blue"}
                onPress={() => handleMarkerPress(marker)}
              >
                <Callout tooltip>
                  <View>
                    <View style={styles.bubble}>
                      <Text style={styles.name}>{marker.type_Bien}</Text>
                      <Text>{marker.description}</Text>
                      {marker.photo && (
                        <Image
                          style={styles.image}
                          source={{
                            uri: marker.photo,
                          }}
                        />
                      )}
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          } else {
            console.warn(`Marker ${index} does not have a valid coordinate.`);
          }
        })}
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
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={() => {
          setVisible(!visible);
        }}
      >
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Add a new announcement</Text>
              <TextInput
                placeholder="Intermidiaire ID"
                style={styles.modalText}
                onChangeText={setIntermidiaireID}
                value={intermidiaireID.toString()}
              />
              <TextInput
                placeholder="Citoyen ID"
                style={styles.modalText}
                onChangeText={setCitoyenId}
                value={citoyenId.toString()}
              />
              <TextInput
                placeholder="Status"
                style={styles.modalText}
                onChangeText={setStatus}
                value={status}
              />
              <TextInput
                placeholder="Motif"
                style={styles.modalText}
                onChangeText={setMotif}
                value={motif}
              />
              <TextInput
                placeholder="Delai"
                style={styles.modalText}
                onChangeText={setDelai}
                value={delai.toString()}
              />
              <TextInput
                placeholder="Declaree"
                style={styles.modalText}
                onChangeText={setDeclaree}
                value={Declaree}
              />
              <TextInput
                placeholder="Annonce ID"
                style={styles.modalText}
                onChangeText={setAnnonceId}
                value={AnnonceId}
              />
              <TextInput
                style={styles.input}
                placeholder="Prix"
                value={price.toString()}
                onChangeText={setPrice}
              />
              <TextInput
                style={styles.input}
                placeholder="Surface_bien"
                value={surface.toString()}
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

              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={handleSubmit}
              >
                <Text style={styles.textStyle}>Add Announcement</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: "#f44336" }}
                onPress={handleCancel}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </Modal>
      <FontAwesome
        name="plus"
        size={24}
        color="black"
        onPress={() => setVisible(true)}
        style={styles.fab}
      />
    </Layout>
  );
};



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