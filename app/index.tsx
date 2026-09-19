import { OndaLogo } from "@/components/onda-logo";
import { Link, Redirect } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { API_URL } from "../constants/api";

import "../global.css";


export default function Index() {

  const [destination, setDestination] = useState<'welcome' | 'create-profile' | 'conversations'>('welcome')
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        console.log(token);

        if (token) {
          const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            setDestination('welcome');
          } else {
            const data = await response.json();
            setDestination(data.data.username ? 'conversations' : 'create-profile');
          }
        } else {
          setDestination('welcome');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setDestination('welcome');
      } finally {
        setIsLoading(false);
      }

      
    }

    checkToken();
  }, []);

  if (isLoading) {
    return <View className="flex-1 bg-white dark:bg-[#151718]" />;
  }

  if (destination === 'create-profile') {
    return <Redirect href="/(auth)/create-profile" />;
  }

  if (destination === 'conversations') {
    return <Redirect href="/(tabs)/conversations" />;
  }

  return (
    <View className="flex-1 bg-white px-4 dark:bg-[#151718]">


      {/* Contenu principal */}
      <View className="flex-1 items-center justify-center">

        {/* Logo */}
        <View className="p-0">
          <OndaLogo width={120} height={120} />
        </View>

        {/* Texte */}
        <Text className="mt-6 text-2xl font-bold text-black dark:text-[#ECEDEE]">
          Bienvenue sur Onda
        </Text>
        
        <Text className="mt-2 text-center text-base text-gray-500 dark:text-[#9BA1A6]">
          La messagerie fluide et instantanée.
        </Text>
      </View>

      {/* Partie basse */}

      <View className="pb-8">

         <Link href="/(auth)/phone" asChild>
          <Pressable className="w-full bg-blue-600 rounded-xl py-4 items-center border border-dashed border-blue-300">
            <Text className="text-white text-lg w-full font-semibold text-center">Se connecter</Text>
          </Pressable>
        </Link>

        <Text className="mt-3 text-center text-sm text-gray-400 dark:text-[#9BA1A6]">
          En continuant, vous acceptez nos conditions
          {"\n"}
          d&apos;utilisation.
          d&apos;utilisation.
        </Text>



      </View>

    </View>
  )

}