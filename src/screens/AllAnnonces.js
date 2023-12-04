import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { Layout, Text, TopNav, themeColor, useTheme,} from "react-native-rapi-ui";
import FilterBar from "../components/utils/FilterBar";
import * as Location from 'expo-location';



export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [region, setRegion] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [selectedAnnonce, setSelectedAnnonce] = useState(annonces[0]);


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
        id: marker.id,
        coordinate: {
          latitude: marker.latitude ? parseFloat(marker.latitude) : 0,
          longitude: marker.longitude ? parseFloat(marker.longitude) : 0,
        },
        type_bien: marker.type_bien,
        prix_bien: marker.prix_bien,
        date_annonce: marker.date_annonce,
        statut: marker.statut,
        type_operation: marker.type_operation,
        description: marker.description,
        motif_rejet: marker.motif_rejet,
        delai: marker.delai,
        etat: marker.etat,
        intermediaire_id: marker.intermediaire_id,
        photo: marker.photo,
      }));

      setAnnonces(data);
      setSelectedAnnonce(data[0]); // Set the first announcement as selected
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


  const handleAnnonceSelect = (annonce) => {
    setSelectedAnnonce(annonce);
  };

  return (
    <Layout>
      <TopNav
        middleContent="Annonces"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : "#191921"}
          />
        }
        leftAction={() => navigation.goBack()}
      />

      <FilterBar />
      <MapView
        style={{ flex: 1 }}
        region={
          selectedAnnonce
            ? {
              latitude: selectedAnnonce.coordinate.latitude,
              longitude: selectedAnnonce.coordinate.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }
            : {
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }
        }
      >
        {annonces.map((annonce) => (
          <Marker
            key={annonce.id}
            coordinate={annonce.coordinate}
            description={annonce.description}
          />
        ))}
      </MapView>


      



      <View style={{ flex: 1 }}>
        <FlatList
          data={annonces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAnnonceSelect(item)}>
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                }}
              >


                <Text>type: {item.type_bien} m²</Text>
                <Text>Prix: ${item.prix_bien}</Text>
                <Text>Description: {item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Layout>
  );
}