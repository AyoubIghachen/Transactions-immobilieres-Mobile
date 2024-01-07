import * as Linking from 'expo-linking';
import { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from "react-native-modal";
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
        if (annonce.statut === "RESERVEE") {
            alert('Suppression est annulée car l\'annonce est réservée par un intermédiaire');
            return;
        }

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

    const images = annonce.photo ? annonce.photo.split(';').map(url => ({ url })) : [];

    return (
        <View style={styles.container}>
            <ScrollView>

                <View style={styles.card}>

                    <View style={styles.container}>
                        <View>
                            <Text style={styles.title}>Statut: </Text>
                            <Text style={styles.normalText}>{annonce.statut}</Text>
                        </View>
                        <View>
                            <Text style={styles.title}>Etat: </Text>
                            <Text style={styles.normalText}>{annonce.etat}</Text>
                        </View>

                        {annonce.etat === "REJETER" && (
                            <View style={styles.iconTextContainer}>
                                <Text style={{ color: 'green' }}>Motif de rejet: </Text>
                                <Text style={styles.normalText}>{annonce.motif_rejet}</Text>
                            </View>
                        )}

                        <View style={styles.iconTextContainer}>
                            <Text style={{ color: 'green' }}>Type de bien: </Text>
                            <Text style={styles.normalText}>{annonce.type_bien}</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Text style={{ color: 'green' }}>Operation: </Text>
                            <Text style={styles.normalText}>{annonce.type_operation}</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Text style={{ color: 'green' }}>Surface: </Text>
                            <Text style={styles.normalText}>{annonce.surface} m²</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Text style={{ color: 'green' }}>Prix: </Text>
                            <Text style={styles.normalText}>{annonce.prix_bien} Dhs</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Text style={{ color: 'green' }}>Description: </Text>
                            <Text style={styles.normalText}>{annonce.description}</Text>
                        </View>
                    </View>


                    {annonce.justificatif && (annonce.justificatif.split(';').map((url, index) => {
                        // Split the URL by slashes and get the last part
                        const urlParts = url.split('/');
                        const fileNameWithTimestamp = urlParts[urlParts.length - 1];

                        // Split the file name by underscore and remove the last part (timestamp)
                        const fileNameParts = fileNameWithTimestamp.split('_');
                        fileNameParts.pop();
                        const fileName = decodeURIComponent(fileNameParts.join('_')); // Decode URL-encoded characters

                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.pdfButton}
                                onPress={() => Linking.openURL(url)}
                            >
                                <Text style={styles.pdfButtonText}>{fileName}</Text>
                            </TouchableOpacity>
                        );
                    }))}

                    {annonce.photo && annonce.photo.split(';').map((url, index) => (
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

    pdfButton: {
        backgroundColor: 'yellowgreen',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        marginBottom: 20,
        width: '100%', // Make the button take the full width of the modal
    },
    pdfButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center', // Center the text inside the button
    },
    normalText: {
        flexShrink: 1,
    },
    iconTextContainer: {
        flexDirection: 'row',
    },
});

export default DetailsMyAnnonces;