import { API_URL } from '@/constants/api';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Pressable, Text, View } from 'react-native';


export default function Communities() {

    const handleLogout = async () => {
        const token = await SecureStore.getItemAsync('token');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        try {
            if (token && refreshToken) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ refreshToken }),
                });
            }
        } catch (error) {
            // Hors ligne : la déconnexion locale doit quand même aboutir.
            console.error('Erreur lors de la déconnexion :', error);
        }

        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refreshToken');
        router.replace('/');
    };


    return (
        <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-[#151718]">
            <Text className="mb-6 text-lg font-semibold text-[#11181C] dark:text-[#ECEDEE]">Communautés</Text>

            <Pressable
                onPress={handleLogout}
                className="rounded-xl bg-red-500 px-5 py-3"
                accessibilityRole="button"
            >
                <Text className="text-base font-medium text-black dark:text-white">Se déconnecter</Text>
            </Pressable>
        </View>
    )
}