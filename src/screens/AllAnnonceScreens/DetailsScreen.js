import { useContext, useEffect, useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../AuthContext';
// import AnnonceCard from "../../components/utils/AnnonceCard";


function DetailsScreen({ route, navigation }) {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Détails de l\'annonce',
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTintColor: '#333',
        });
    }, [navigation]);

    const { annonce } = route.params;
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleDemander = async () => {
        try {
            const demandeResponse = await fetch('http://192.168.43.59:3002/demandes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    id_annonce: annonce.id,
                    id_demmandeur: user.id,
                })
            });

            if (!demandeResponse.ok) {
                let errorMessage = 'Network response was not ok';

                if (demandeResponse.status === 400) {
                    errorMessage = 'Vous avez déjà demandé cette annonce !';
                } else if (demandeResponse.status === 500) {
                    errorMessage = 'Internal Server Error';
                }

                throw new Error(errorMessage);
            }

            alert('La demande a été envoyée avec succès.');
            navigation.goBack();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const images = annonce.photo ? annonce.photo.split(';').map(url => ({ url })) : [];

    return (
        <View style={styles.container}>
            <ScrollView>

                <View style={styles.card}>
                    <Text style={styles.title}>ID: {annonce.id}</Text>
                    <Text>Type de bien: {annonce.type_bien}</Text>
                    <Text>Delai: {annonce.delai} Jour (s)</Text>
                    <Text>Prix: {annonce.prix_bien} Dhs</Text>
                    <Text>Surface: {annonce.surface} m²</Text>
                    <Text>Type d'opération: {annonce.type_operation}</Text>
                    <Text>Etat: {annonce.etat}</Text>
                    <Text>Statut: {annonce.statut}</Text>
                    <Text>Description: {annonce.description}</Text>
                    {annonce.photo && annonce.photo.split(';').map((url, index) => (
                        <TouchableOpacity key={index} onPress={() => { setImageViewerVisible(true); setCurrentImageIndex(index); }}>
                            <Image source={{ uri: url }} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    {user.id !== annonce.annonceur_id && <Button title="Demander" onPress={handleDemander} color="#841584" />}
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

export default DetailsScreen;