import { Button, View, ScrollView, StyleSheet } from 'react-native';
import AnnonceCard from "../components/utils/AnnonceCard";


function DetailsScreen({ route, navigation }) {
    const { annonce } = route.params;

    const handleDemander = async () => {
        try {
            const demandeResponse = await fetch('http://192.168.43.59:3002/demandes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    annonce: {
                        id: annonce.id
                    },
                    demandeur: {
                        id: 4 // modify when you implement auth
                    }
                })
            });

            if (!demandeResponse.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Demande sent successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send demande');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <AnnonceCard annonce={annonce} />

                <View style={styles.buttonContainer}>
                    <Button title="Demander" onPress={handleDemander} color="#841584" />
                    <Button title="Retourner" onPress={() => navigation.goBack()} color="#841584" />
                </View>
            </ScrollView>
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
});

export default DetailsScreen;