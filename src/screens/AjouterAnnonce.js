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
  const [mapKey, setMapKey] = useState("");
  const [region, setRegion] = useState(null);
  const [addMarker, setAddMarker] = useState(false);
  const [id, setId] = useState(null);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [surface, setSurface] = useState("");
  const [type_bien, setType_bien] = useState("");
  const [prix_bien, setPrix_bien] = useState("");
  const [date_annonce, setDate_annonce] = useState(new Date());
  const [statut, setStatut] = useState("");
  const [type_operation, setType_operation] = useState("");
  const [description, setDescription] = useState("");
  const [motif_rejet, setMotif_rejet] = useState("");
  const [delai, setDelai] = useState("");
  const [etat, setEtat] = useState("");
  const [intermediaire_id, setIntermediaire_id] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    fetchAnnouncements();
    getLocation();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://192.168.43.59:3002/annonces");
      let data = await response.json();

      // Adjust the structure of the markers
      data = data.map(marker => ({
        coordinate: {
          latitude: parseFloat(marker.latitude),
          longitude: parseFloat(marker.longitude),
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
    setId(marker.id);
    setLongitude(marker.longitude);
    setLatitude(marker.latitude);
    setSurface(marker.surface);
    setType_bien(marker.type_bien);
    setPrix_bien(marker.prix_bien);
    setDate_annonce(marker.date_annonce);
    setStatut(marker.statut);
    setType_operation(marker.type_operation);
    setDescription(marker.description);
    setMotif_rejet(marker.motif_rejet);
    setDelai(marker.delai);
    setEtat(marker.etat);
    setIntermediaire_id(marker.intermediaire_id);
    setPhoto(marker.photo);
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.43.59:3002/annonces", { // replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          intermediaire_id: intermediaire_id,
          date_annonce: date_annonce,
          statut: statut,
          motif_rejet: motif_rejet,
          delai: delai,
          etat: etat,
          photo: photo.join(';'),
          type_operation: type_operation,
          type_bien: type_bien,
          surface: surface,
          prix_bien: prix_bien,
          description: description,
          latitude: region.latitude,
          longitude: region.longitude,
        }),
      });

      if (response.ok) {
        if (region && typeof region.latitude === 'number' && typeof region.longitude === 'number') {
          console.log('Announcement added successfully');
          // Create a new marker
          const newMarker = {
            id,
            latitude: region.latitude,
            longitude: region.longitude,
            surface,
            type_bien,
            prix_bien,
            date_annonce,
            statut,
            type_operation,
            description,
            motif_rejet,
            delai,
            etat,
            intermediaire_id,
            photo,
          };
          // Add the new marker to the markers
          setMarkers([...markers, newMarker]);
        } else {
          console.error('Invalid region:', region);
        }
        handleCancel(); // reset the form fields and close the modal
      } else {
        console.error('Error adding announcement:', response.status, response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setId(null);
    setLongitude("");
    setLatitude("");
    setSurface("");
    setType_bien("");
    setPrix_bien("");
    setDate_annonce(new Date());
    setStatut("");
    setType_operation("");
    setDescription("");
    setMotif_rejet("");
    setDelai("");
    setEtat("");
    setIntermediaire_id("");
    setPhoto("");
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
      // Append the new image URL to the photo state
      setPhoto(oldPhoto => oldPhoto ? [...oldPhoto, url] : [url]);
    }
  };

  //console.log(markers);

  return (
    <Layout>
      <MapView
        key={mapKey}
        style={styles.map}
        onPress={(e) => {
          setRegion({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
          handleMapPress(e);
        }}
        region={region}
      >
        {markers.map((marker, index) => {
          if (marker.coordinate && marker.coordinate.latitude && marker.coordinate.longitude) {
            return (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                pinColor={marker.type_bien === "VILLA" ? "red" : "blue"}
                onPress={() => handleMarkerPress(marker)}
              >
                <Callout tooltip>
                  <View>
                    <View style={styles.bubble}>
                      <Text style={styles.name}>{marker.type_bien}</Text>
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
              <Text style={styles.modalTitle}>Ajouter une annonce</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Intermediaire ID:</Text>
                <TextInput
                  placeholder="ID"
                  style={styles.input2}
                  onChangeText={setIntermediaire_id}
                  value={intermediaire_id.toString()}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Delai:</Text>
                <TextInput
                  placeholder="Delai"
                  style={styles.input2}
                  onChangeText={(value) => setDelai(Number(value))}
                  value={delai.toString()}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Prix:</Text>
                <TextInput
                  style={styles.input2}
                  placeholder="Prix"
                  value={prix_bien.toString()}
                  onChangeText={setPrix_bien}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Surface:</Text>
                <TextInput
                  style={styles.input2}
                  placeholder="Surface_bien"
                  value={surface.toString()}
                  onChangeText={setSurface}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Type de bien:</Text>
                <Picker
                  selectedValue={type_bien}
                  onValueChange={(itemValue) => setType_bien(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="MAISON" value="MAISON" color="#0000FF" />
                  <Picker.Item label="VILLA" value="VILLA" color="#008000" />
                  <Picker.Item label="APPARTEMENT" value="APPARTEMENT" color="#FFA500" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Type d'opération:</Text>
                <Picker
                  selectedValue={type_operation}
                  onValueChange={(itemValue) => setType_operation(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="VENDRE" value="VENDRE" color="#0000FF" />
                  <Picker.Item label="LOUER" value="LOUER" color="#008000" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Etat:</Text>
                <Picker
                  selectedValue={etat}
                  onValueChange={(itemValue) => setEtat(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="NULL" value="" color="#FFA500" />
                  <Picker.Item label="PUBLIEE" value="PUBLIEE" color="#0000FF" />
                  <Picker.Item label="REJETER" value="REJETER" color="#008000" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Statut:</Text>
                <Picker
                  selectedValue={statut}
                  onValueChange={(itemValue) => setStatut(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="RESERVEE" value="RESERVEE" color="#0000FF" />
                  <Picker.Item label="EN_ATTENTE" value="EN_ATTENTE" color="#008000" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Motif de rejet:</Text>
                <TextInput
                  placeholder="Motif_rejet"
                  style={styles.input2}
                  onChangeText={setMotif_rejet}
                  value={motif_rejet}
                />
              </View>
              <TextInput
                style={[styles.inputDescription, { height: 100 }]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                style={[styles.buttonText1, { width: '53%' }]}
                onPress={pickImage}
              >
                <Text style={styles.textStyle1}>Choisir une image</Text>
              </TouchableOpacity>

              {photo && photo.map((url, index) => (
                <View key={index} style={{ position: 'relative', marginBottom: 10 }}>
                  <Image source={{ uri: url }} style={{ width: 200, height: 200 }} />
                  <TouchableOpacity
                    style={{ position: 'absolute', right: 0, top: 0 }}
                    onPress={() => {
                      setPhoto(oldPhoto => oldPhoto.filter((_, i) => i !== index));
                    }}
                  >
                    <FontAwesome name="times" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.twoButtonContainer}>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={handleSubmit}
                >
                  <Text style={styles.textStyle}>Ajouter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: "#f44336" }}
                  onPress={handleCancel}
                >
                  <Text style={styles.textStyle}>Retourner</Text>
                </TouchableOpacity>
              </View>

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
    backgroundColor: '#F5F5F5',
  },
  map: {
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  inputDescription: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 5,
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
    backgroundColor: '#4CAF50',
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
  buttonText1: {
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    padding: 15,
    elevation: 5,
    width: 200,
    marginVertical: 10,
  },
  textStyle1: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C8E6C9',
  },
  landingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 30,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  twoButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
  },
  input2: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});