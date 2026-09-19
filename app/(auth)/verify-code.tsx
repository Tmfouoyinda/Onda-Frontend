import { useColorScheme } from "@/hooks/use-color-scheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { API_URL } from "@/constants/api";

import "@/global.css";

export default function VerifyCode() {
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const { phoneNumber } = useLocalSearchParams<{
    phoneNumber: string;
  }>();

    const handleVerifyCode = async () => {
        if (!verifyCode.trim()) {
        Alert.alert(
            "Code requis",
            "Veuillez saisir le code reçu par SMS."
        );
        return;
        }

        if (verifyCode.length !== 6) {
        Alert.alert(
            "Code invalide",
            "Le code doit contenir 6 chiffres."
        );
        return;
        }

        if (!phoneNumber) {
        Alert.alert(
            "Erreur",
            "Numéro de téléphone introuvable."
        );
        return;
        }

        setIsLoading(true);

        try {
        const response = await fetch(`${API_URL}/auth/verify-code`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            phone_number: phoneNumber,
            code: verifyCode,
            }),
        });

        const data = await response.json();

        // Erreur HTTP
        if (!response.ok) {
            if (response.status === 400) {
            Alert.alert(
                "Code incorrect",
                data.message || "Le code saisi est incorrect."
            );
            } else if (response.status === 429) {
            Alert.alert(
                "Trop de tentatives",
                data.message ||
                "Trop de tentatives. Veuillez patienter avant de réessayer."
            );
            } else {
            Alert.alert(
                "Erreur",
                data.message || "Impossible de vérifier le code."
            );
            }

            return;
        }

        // Succès
        if (!data.token) {
            Alert.alert(
            "Erreur",
            "Le serveur n'a pas retourné de token."
            );
            return;
        }

        // Stockage sécurisé du token
        await SecureStore.setItemAsync("token", data.token);

        // Continuer vers la création du profil
        router.replace("/(auth)/create-profile");

        } catch (error) {
        console.error("Erreur :", error);

        Alert.alert(
            "Erreur",
            "Impossible de contacter le serveur."
        );
        } finally {
        setIsLoading(false);
        }
    };


    const handleResendCode = async () => {
        if (!phoneNumber) {
          Alert.alert(
          "Erreur",
          "Numéro de téléphone introuvable."
          );
          return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/send-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone_number: phoneNumber,
            }),
            });

            const data = await response.json();

            if (!response.ok) {
            if (response.status === 429) {
                Alert.alert(
                "Trop de demandes",
                data.message ||
                    "Veuillez patienter avant de demander un nouveau code."
                );
            } else {
                Alert.alert(
                "Erreur",
                data.message || "Impossible d'envoyer le code."
                );
            }

            return;
            }

            Alert.alert(
            "Code envoyé",
            "Un nouveau code vous a été envoyé par SMS."
            );

        } catch (error) {
            console.error("Erreur réseau :", error);

            Alert.alert(
            "Erreur",
            "Impossible de contacter le serveur."
            );
        }
    };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-[#151718]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 32,
          paddingVertical: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="overflow-hidden rounded-[24px] bg-white shadow-lg dark:bg-[#202224]">

          {/* Barre de progression */}
          <View className="h-[7px] bg-[#E8E7EC]">
            <View className="h-full w-[66%] bg-[#0068C9]" />
          </View>

          <View className="px-8 pt-12 pb-10">

            {/* Retour */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-6"
            >
              <MaterialIcons
                name="arrow-back"
                size={28}
                color={colorScheme === "dark" ? "#ECEDEE" : "#17181C"}
              />
            </TouchableOpacity>

            {/* Titre */}
            <View className="items-center">
              <Text className="text-3xl font-bold text-[#17181C] dark:text-[#ECEDEE]">
                Vérification
              </Text>

              <Text className="mt-4 text-center text-base leading-6 text-[#464B5A] dark:text-[#B7BBC0]">
                Entrez le code à 6 chiffres que nous avons envoyé au
              </Text>

              <Text className="mt-1 text-base font-semibold text-[#17181C] dark:text-[#ECEDEE]">
                {phoneNumber}
              </Text>
            </View>

            {/* Code */}
            <Text className="mb-3 mt-10 text-lg font-medium text-[#17181C] dark:text-[#ECEDEE]">
              Code de vérification
            </Text>

            <TextInput
              value={verifyCode}
              onChangeText={(text) => {
                const numbersOnly = text.replace(/[^0-9]/g, "");
                setVerifyCode(numbersOnly);
              }}
              placeholder="000000"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              className="h-[60px] rounded-lg border-2 border-[#BEC2D0] px-4 text-center text-2xl tracking-[8px] text-[#17181C] dark:border-[#555A61] dark:text-[#ECEDEE]"
            />

            {/* Bouton */}
            <TouchableOpacity
              onPress={handleVerifyCode}
              disabled={isLoading}
              className={`h-[60px] rounded-lg mt-8 items-center justify-center ${
                isLoading
                  ? "bg-[#7AAFE0]"
                  : "bg-[#0068C9]"
              }`}
            >
              <Text className="text-white text-lg font-semibold">
                {isLoading
                  ? "Vérification..."
                  : "Vérifier"}
              </Text>
            </TouchableOpacity>

            {/* Renvoyer */}
            <TouchableOpacity
            onPress={handleResendCode}
              disabled={isLoading}
              className="items-center mt-6"
            >
              <Text className="text-[#0068C9] text-base font-medium">
                Renvoyer le code
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
