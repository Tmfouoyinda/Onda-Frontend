import { OndaLogo } from '@/components/onda-logo';
import { API_URL } from '@/constants/api';
import { router } from 'expo-router';
import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import '@/global.css';

const countries = [
  { name: 'France', code: '+33', iso: 'FR', flag: 'FR' },
  { name: 'Congo', code: '+242', iso: 'CG', flag: 'CG' },
  { name: 'Gabon', code: '+241', iso: 'GA', flag: 'GA' },
];

export default function Phone() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+33');
  const [countryIso, setCountryIso] = useState<CountryCode>('FR');

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Numéro requis', 'Veuillez saisir votre numéro de téléphone.');
      return;
    }
    console.log(API_URL);

    setLoading(true);
    try {
      const parsedPhoneNumber = parsePhoneNumber(`${countryCode}${phoneNumber}`, countryIso);

      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        Alert.alert('Numéro invalide', 'Veuillez saisir un numéro de téléphone valide.');
        return;
      }

      const response = await fetch(`${API_URL}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: parsedPhoneNumber.number })
      });
      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          response.status === 429 ? 'Trop de demandes' : 'Erreur',
          response.status === 429
            ? "Un code a déjà été demandé. Veuillez patienter avant d'en demander un nouveau."
            : data.message || "Impossible d'envoyer le code."
        );
        return;
      }

      router.push({
        pathname: '/(auth)/verify-code',
        params: { phoneNumber: parsedPhoneNumber.number },
      });
    } catch (error) {
      console.log('Erreur de connexion:', error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-[#151718]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 32,
          paddingVertical: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-[24px] bg-white shadow-lg dark:bg-[#202224]">
          <View className="h-[7px] bg-[#E8E7EC]">
            <View className="h-full w-[33%] bg-[#0068C9]" />
          </View>

          <View className="px-8 pb-10 pt-12">
            <View className="items-center">
              <OndaLogo size={128} />
              <Text className="-mt-6 text-4xl font-bold text-black dark:text-[#ECEDEE]">Onda</Text>
              <Text className="mt-4 text-center text-base leading-6 text-[#464B5A] dark:text-[#B7BBC0]">
                Saisissez votre numéro de téléphone pour commencer.{"\n"}
                Nous vous enverrons un SMS pour vérifier votre compte.
              </Text>
            </View>

            <Text className="mb-3 mt-10 text-lg font-medium text-[#17181C] dark:text-[#ECEDEE]">
              Numéro de téléphone
            </Text>

            <View className="h-[60px] flex-row overflow-hidden rounded-lg border-2 border-[#BEC2D0] dark:border-[#555A61]">
              <TouchableOpacity
                onPress={() => setShow(true)}
                className="w-[90px] items-center justify-center border-r-2 border-[#BEC2D0] dark:border-[#555A61]">
                <Text className="text-lg text-[#3F4554] dark:text-[#D5D8DC]">{countryCode}</Text>
              </TouchableOpacity>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="6 12 34 56 78"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                autoComplete="tel"
                className="flex-1 px-4 text-lg text-[#17181C] dark:text-[#ECEDEE]"
              />
            </View>

            <TouchableOpacity
              onPress={handleSendCode}
              disabled={isLoading}
              className={`mt-8 h-[60px] items-center justify-center rounded-lg ${isLoading ? 'bg-[#7AAFE0]' : 'bg-[#0068C9]'}`}>
              <Text className="text-lg font-semibold text-white">
                {isLoading ? 'Envoi...' : 'Continuer'}
              </Text>
            </TouchableOpacity>

            <Text className="mt-8 text-center text-xs text-[#7A7E89]">
              Des frais de SMS et de données peuvent s&apos;appliquer.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={show}
        transparent
        animationType="slide"
        onRequestClose={() => setShow(false)}>
        <View className="flex-1 justify-end bg-black/30">
          <View className="rounded-t-[28px] bg-white px-5 pb-8 pt-5 dark:bg-[#202224]">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-semibold text-[#17181C] dark:text-[#ECEDEE]">
                Choisir un pays
              </Text>
              <TouchableOpacity onPress={() => setShow(false)}>
                <Text className="text-base font-medium text-[#0068C9]">Fermer</Text>
              </TouchableOpacity>
            </View>

            {countries.map((country) => (
              <TouchableOpacity
                key={country.iso}
                onPress={() => {
                  setCountryIso(country.iso as CountryCode);
                  setCountryCode(country.code);
                  setShow(false);
                }}
                className="flex-row items-center justify-between border-b border-[#E8E7EC] py-4 dark:border-[#303234]">
                <Text className="text-base font-medium text-[#17181C] dark:text-[#ECEDEE]">
                  {country.flag}  {country.name}
                </Text>
                <Text className="text-base text-[#464B5A] dark:text-[#B7BBC0]">{country.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
