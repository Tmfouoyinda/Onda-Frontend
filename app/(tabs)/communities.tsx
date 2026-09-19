import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Pressable, Text, View } from 'react-native';


export default function Communities() {

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
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