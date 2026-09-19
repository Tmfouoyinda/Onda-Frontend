import { OndaLogo } from "@/components/onda-logo";
import { API_URL } from "@/constants/api";
import "@/global.css";
import { router } from "expo-router";
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

export default function CreateProfile() {
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async () => {
    if (!username.trim() || !displayName.trim()) {
      Alert.alert(
        "Champs requis",
        "Veuillez remplir votre nom d’utilisateur et votre nom affiché."
      );
      return;
    }

    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert(
          "Erreur",
          "Session introuvable. Veuillez vous reconnecter."
        );
        return;
      }

      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          display_name: displayName.trim(),
          bio: bio.trim(),
        }),
      });

      let data: any = {};
      const contentType = response.headers.get("content-type") || "";

      try {
        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = {
            message:
              text && text.includes("<")
                ? "Le serveur a renvoyé une réponse HTML au lieu d'un JSON. Vérifie que le backend est bien démarré et que la route /api/auth/profile existe."
                : text || "Réponse invalide du serveur.",
          };
        }
      } catch (error) {
        console.error("Erreur de parsing JSON du profil :", error);
        data = {
          message:
            "Le serveur n’a pas répondu avec un JSON valide. Vérifie que le backend est bien démarré et que la route /api/auth/profile est active.",
        };
      }

      if (!response.ok) {
        Alert.alert(
          "Erreur",
          data?.message || "Une erreur est survenue lors de la mise à jour du profil."
        );
        return;
      }

      Alert.alert(
        "Profil mis à jour",
        "Votre profil a été mis à jour avec succès."
      );
      router.replace("/(tabs)/conversations");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour du profil."
      );
    } finally {
      setLoading(false);
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
          paddingHorizontal: 24,
          paddingVertical: 28,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center">
          <View className="relative items-center">
            
			<View>
        <OndaLogo size={80} />
			</View>

            <OndaLogo
              size={240}
              opacity={0.05}
              style={{ position: "absolute", right: -32, top: 13 }}
            />
          </View>

          <Text className="mt-8 text-center text-4xl font-bold text-blue-500 dark:text-[#66B5FF]">
            Mettre à jour votre profil
          </Text>

          <Text className="mt-3 text-center text-base text-[#464B5A] dark:text-[#B7BBC0]">
            Personnalisez votre compte pour commencer à discuter.
          </Text>



          <View className="mt-8 gap-5">
            <View>
              <Text className="mb-2 text-base font-medium text-[#17181C] dark:text-[#ECEDEE]">
                Nom Complet 
              </Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Ex: Jean Dupont"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoCorrect={false}
                className="h-[56px] rounded-xl border border-[#BEC2D0] bg-white px-4 text-base text-[#17181C] dark:border-[#555A61] dark:bg-[#202224] dark:text-[#ECEDEE]"
              />
            </View>

            <View>
              <Text className="mb-2 text-base font-medium text-[#17181C] dark:text-[#ECEDEE]">
                Nom d&apos;utilisateur
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="@jeandupont"
                placeholderTextColor="#9CA3AF"
                className="h-[56px] rounded-xl border border-[#BEC2D0] bg-white px-4 text-base text-[#17181C] dark:border-[#555A61] dark:bg-[#202224] dark:text-[#ECEDEE]"
              />
            </View>

            <View>
              <Text className="mb-2 text-base font-medium text-[#17181C] dark:text-[#ECEDEE]">
                Bio
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Un petit mot sur vous..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="min-h-[120px] rounded-xl border border-[#BEC2D0] bg-white px-4 py-3 text-base text-[#17181C] dark:border-[#555A61] dark:bg-[#202224] dark:text-[#ECEDEE]"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`mt-8 h-[60px] items-center justify-center rounded-xl ${
              isLoading ? "bg-[#7AAFE0]" : "bg-[#0068C9]"
            }`}
          >
            <Text className="text-lg font-semibold text-white">
              {isLoading ? "Création..." : "Créer mon profil"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
