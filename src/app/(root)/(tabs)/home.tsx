import { useLocationStore } from "@/store";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const { user } = useUser();
    const { signOut } = useAuth();

    const { setUserLocation, setDestinationLocation } = useLocationStore();

    const handleSignOut = () => {
        signOut();
        router.replace(("/(auth)//sign-in"))
    }
    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <Text>Home</Text>
        </SafeAreaView>
    );
}

export default Home;