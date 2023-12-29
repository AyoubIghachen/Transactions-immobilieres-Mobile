import React, { useEffect, useState } from "react";
import { View, Linking, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import {
  Text,
  SectionContent,
} from "react-native-rapi-ui";
import Background from '../screens/AuthScreens/components/Background'
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';


export default function ({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Acceuil',
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#333',
    });
  }, [navigation]);

  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample data for photo album
  const photos = [
    { id: '1', uri: 'https://st2.depositphotos.com/1041088/5192/i/450/depositphotos_51925277-stock-photo-american-house-with-beautiful-landscape.jpg' },
    { id: '2', uri: 'https://img.freepik.com/free-photo/blue-house-with-blue-roof-sky-background_1340-25953.jpg?size=626&ext=jpg&ga=GA1.1.1803636316.1701216000&semt=ais' },
    { id: '3', uri: 'https://img.freepik.com/premium-photo/fantasy-house_948605-35.jpg' },
    { id: '4', uri: 'https://img.freepik.com/premium-photo/fantasy-world-with-bridge-house-it_889779-20.jpg' },
    { id: '5', uri: 'https://viarami.com/wp-content/uploads/2022/09/fantasy-house-wild-ocean-adventure-6.jpg' },
    { id: '6', uri: 'https://mygate.com/wp-content/uploads/2023/07/110.jpg' },
    { id: '7', uri: 'https://cdn.luxe.digital/media/20230123162705/most-expensive-houses-in-the-world-reviews-luxe-digital-1200x600.jpg' },
    { id: '8', uri: 'https://people.com/thmb/Rq4-T9Jiu-hohH1zxcPFgdeszBQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(780x211:782x213)/barbie-Ken-malibu-Dream-House-Airbnb-tout-e18b10475a30478992ea81a023e8c1be.jpg' },
    { id: '9', uri: 'https://m.cbhomes.com/p/951/4867176/68F406fcc4d6498/original.jpg' },
    { id: '10', uri: 'https://i.pinimg.com/originals/19/56/4a/19564a5a312adc8dd0d4d051358106cd.jpg' },
    { id: '11', uri: 'https://www.weston.org/ImageRepository/Document?documentID=1319' },
    { id: '12', uri: 'https://cdn.onekindesign.com/wp-content/uploads/2021/08/Colonial-Style-Countryside-Retreat-Chango-Co-01-1-Kindesign.jpg' },
  ];

  const images = photos.map(photo => ({ url: photo.uri }));

  return (
    <Background>
      <ScrollView>
        <SectionContent>
          <Text fontWeight="bold" style={styles.title}>
            Bienvenue dans l'application !
          </Text>
          <Text style={styles.subtitle}>
            Voici quelques informations générales sur les transactions immobilières :
          </Text>
          <Text>
            Les transactions immobilières impliquent le transfert des droits de propriété immobilière d'une partie à une autre. Elles peuvent inclure des ventes, des locations, des hypothèques, et plus encore.
          </Text>
          <Text style={styles.subtitle}>
            Consultez notre album photo :
          </Text>
          <View style={styles.photoAlbum}>
            {photos.map((photo, index) => (
              <TouchableOpacity key={photo.id} onPress={() => { setImageViewerVisible(true); setCurrentImageIndex(index); }}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
              </TouchableOpacity>
            ))}
          </View>

        </SectionContent>
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}
      >
        <Text style={styles.buttonText}>Acceder a la page web</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isImageViewerVisible}
        style={{ width: '100%', height: '100%', margin: 0 }}
      >
        <ImageViewer
          imageUrls={images}
          index={currentImageIndex}
          enableSwipeDown={true}
          onSwipeDown={() => setImageViewerVisible(false)}
          renderHeader={() => (
            <TouchableOpacity style={{ padding: 10 }} onPress={() => setImageViewerVisible(false)}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
          )}
        />
      </Modal>

    </Background>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  photoAlbum: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#6699cc', // Gray blue color
    padding: 10, // Add padding to make the button larger
    alignItems: 'center', // Center the text horizontally
  },
  buttonText: {
    color: '#fff', // White color for the text
    fontSize: 16, // Increase the font size
  },
});