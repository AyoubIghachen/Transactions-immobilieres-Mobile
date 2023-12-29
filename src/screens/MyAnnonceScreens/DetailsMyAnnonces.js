import { useState, useEffect } from "react";
import { Alert, Button, Text, Image, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';



function DetailsMyAnnonces({ route, navigation }) {
    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Détails de mon annonce',
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTintColor: '#333',
        });
    }, [navigation]);

    const { annonce } = route.params;
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleDelete = () => {
        Alert.alert(
            "Confirmation",
            "Are you sure you want to delete this annonce?",
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        try {
                            const deleteResponse = await fetch(`http://192.168.43.59:3002/annonces/${annonce.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                },
                            });

                            if (!deleteResponse.ok) {
                                throw new Error('Network response was not ok');
                            }

                            alert('Annonce deleted successfully');
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error:', error);
                            alert('Failed to delete annonce');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const handleEdit = () => {
        navigation.navigate('EditAnnonce', { annonce }); // navigate to the edit screen with the current annonce
    };

    const images = annonce.photo && typeof annonce.photo === 'string' ? annonce.photo.split(';').map(url => ({ url })) : [];

    return (
        <View style={styles.container}>
            <ScrollView>

                <View style={styles.card}>
                    <Text style={styles.title}>ID: {annonce.id}</Text>
                    <Text>Statut: {annonce.statut}</Text>
                    <Text>Etat: {annonce.etat}</Text>
                    <Text>Type de bien: {annonce.type_bien}</Text>
                    <Text>Delai: {annonce.delai} Jour (s)</Text>
                    <Text>Prix: {annonce.prix_bien} Dhs</Text>
                    <Text>Surface: {annonce.surface} m²</Text>
                    <Text>Type d'opération: {annonce.type_operation}</Text>
                    <Text>Description: {annonce.description}</Text>
                    {annonce.photo && typeof annonce.photo === 'string' && annonce.photo.split(';').map((url, index) => (
                        <TouchableOpacity key={index} onPress={() => { setImageViewerVisible(true); setCurrentImageIndex(index); }}>
                            <Image source={{ uri: url }} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Editer" onPress={handleEdit} color="#841584" />
                    <Button title="Supprimer" onPress={handleDelete} color="#841584" />
                    <Button title="Retourner" onPress={() => navigation.goBack()} color="#841584" />
                </View>
            </ScrollView>

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    card: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 10,
    },
});

export default DetailsMyAnnonces;