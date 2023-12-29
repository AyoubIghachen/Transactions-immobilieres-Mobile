import React, {useContext} from "react";
import AuthContext from '../AuthContext';
import { View, StyleSheet } from "react-native";
import {
  Layout,
  Button,
  Text,
  Section,
  SectionContent,
  Avatar,
} from "react-native-rapi-ui";

export default function ({ navigation }) {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <View style={styles.container}>
        <Section style={styles.section}>
          <SectionContent style={styles.sectionContent}>
            <Avatar
              source={{ uri: 'https://img.freepik.com/premium-photo/portrait-young-handsome-man-glasses_127089-1348.jpg' }}
              size="xl"
              shape="round"
              style={styles.avatar}
            />
            <Text style={styles.name}>{user.nom} {user.prenom}</Text>
            <Text style={styles.email}>{user.email}</Text>
            {/* <Button
              text="Edite profile"
              onPress={() => {
                // navigation.navigate("SecondScreen");
              }}
              style={styles.button}
            /> */}
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#f5f5f5',
  },
  section: {
    width: '90%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  sectionContent: {
    paddingTop: 70,
  },
  avatar: {
    alignSelf: 'center',
    marginTop: -50,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    textAlign: "center",
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});