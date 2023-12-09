import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity, View, Button, Image } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { Layout, Text, TopNav, themeColor, useTheme, } from "react-native-rapi-ui";
import FilterBar from "../../components/utils/FilterBar";
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

const ITEMS_PER_PAGE = 50;

export default function ({ navigation }) {
    const { isDarkmode } = useTheme();
    const [region, setRegion] = useState(null);
    const [annonces, setAnnonces] = useState([]);
    const [selectedAnnonce, setSelectedAnnonce] = useState(annonces[0]);
    const [allAnnonces, setAllAnnonces] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMap, setShowMap] = useState(true);


    useFocusEffect(
        React.useCallback(() => {
            fetchAnnouncements();
            getLocation();
        }, [])
    );

    const fetchAnnouncements = async () => {
        try {
            const annonceur_id = 2;
            const response = await fetch(`http://192.168.43.59:3002/annonces/Annonceur/${annonceur_id}`);

            let data = await response.json();

            console.log(`Fetched ${data.length} items.`); // Add this line


            // Adjust the structure of the markers
            data = data.map(marker => ({
                id: marker.id,
                coordinate: {
                    latitude: marker.latitude ? parseFloat(marker.latitude) : 0,
                    longitude: marker.longitude ? parseFloat(marker.longitude) : 0,
                },
                type_bien: marker.type_bien,
                surface: marker.surface,
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

            setAllAnnonces(data);
            setAnnonces(data.slice(0, ITEMS_PER_PAGE));
            if (!selectedAnnonce) setSelectedAnnonce(data[0]); // Set the first announcement as selected
        } catch (error) {
            console.error(error);
        }
    };

    const handleEndReached = () => {
        const nextPage = currentPage;
        const nextSetOfAnnonces = allAnnonces.slice(nextPage * ITEMS_PER_PAGE, (nextPage + 1) * ITEMS_PER_PAGE);

        if (nextSetOfAnnonces.length > 0) {
            setAnnonces(oldAnnonces => [...oldAnnonces, ...nextSetOfAnnonces]);
            setCurrentPage(nextPage + 1);
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
                middleContent="Mes Annonces"
                rightContent={
                    <TouchableOpacity onPress={() => setShowMap(!showMap)}>
                        <Ionicons
                            name={showMap ? "list-outline" : "map-outline"}
                            size={24}
                            color={isDarkmode ? themeColor.white100 : "#191921"}
                        />
                    </TouchableOpacity>
                }
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


            {showMap && (
                <MapView
                    style={{ flex: 0.65 }}
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
            )}

            <View style={styles.container}>
                <FlatList
                    data={annonces}
                    keyExtractor={(item, index) => item.id || String(index)} // Use index as a fallback
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleAnnonceSelect(item)}>
                            <View style={styles.card}>
                                <Image
                                    style={styles.image}
                                    source={
                                        item.photo && item.photo.split(';')[0]
                                            ? { uri: item.photo.split(';')[0] }
                                            : { uri: 'https://placehold.co/200.png' }
                                    }
                                />

                                <Text style={styles.boldText}>Statut: {item.statut}</Text>
                                <Text style={styles.normalText}>Etat: {item.etat}</Text>
                                <Text style={styles.normalText}>Type: {item.type_bien}</Text>
                                <Text style={styles.normalText}>Surface: {item.surface} m²</Text>
                                <Text style={styles.normalText}>Prix: {item.prix_bien} Dhs</Text>
                                <Text style={styles.normalText}>Description: {item.description}</Text>

                                <Button
                                    title="Details"
                                    onPress={() => navigation.navigate('DetailsMyAnnonces', { annonce: item })}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={21} // Try increasing this value
                />
            </View>
        </Layout>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        padding: 10,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    boldText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    normalText: {
        marginTop: 5,
        fontSize: 16,
    },
});