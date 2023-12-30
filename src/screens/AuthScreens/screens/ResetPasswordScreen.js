import React, { useState } from 'react'
import BackButton from '../components/BackButton'
import Background from '../components/Background'
import Button from '../components/Button'
import Header from '../components/Header'
import Logo from '../components/Logo'
import TextInput from '../components/TextInput'
import { emailValidator } from '../helpers/emailValidator'

import { Alert } from 'react-native'
import Mailer from 'react-native-mail'


export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }

    try {
      const response = await fetch(`http://192.168.43.59:3002/utilisateurs/resetPassword/${email.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json();
        Mailer.mail({
          subject: 'Reset Password',
          recipients: [email.value],
          body: `<b>Hey ${data.nom} ${data.prenom}</b>
          <br/>
          <b>Your password has been reset. Your new password is: ${data.password}</b>
          `,
          isHTML: true,
        }, (error, event) => {
          if (error) {
            Alert.alert('Error', 'Could not send mail. Please send a mail to support@geoinfo.com');
          } else {
            navigation.navigate('LoginScreen');
          }
        });
      } else {
        // If the response is not ok, throw an error or return a default error message
        const error = await response.text();
        throw new Error(error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      setEmail({ ...email, error: 'Something went wrong' });
    }
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Récupérer le mot de passe</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="Vous recevrez un email avec votre ancien mot de passe."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Envoyer
      </Button>
    </Background>
  )
}
