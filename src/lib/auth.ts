import * as Linking from "expo-linking";
import { fetchAPI } from "./fetch"; 
import * as SecureStore from "expo-secure-store";

export const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            if (item) {
                console.log(`${key} was used \n`);
            } else {
                console.log(`No values store under key: ${key}`);
            }
            return item;
        } catch (error) {
            console.error("SecureStore get item error: ", error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },

    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return;
        }
    }
};

export const googleOAuth = async (startOAuthFlow: any) => {
    try {
        const { createdSessionId, setActive, signUp } = await startOAuthFlow({
            redirectUrl: Linking.createURL("/(root)/(tabs)/home")
        });

        if (createdSessionId) {
            if (setActive) {
                await setActive({ session: createdSessionId });

                if (signUp.createdUserId) {
                    await fetchAPI("/(api)/user", {
                        method: "POST",
                        body: JSON.stringify({
                            name: `${signUp.firstName} ${signUp.lastName}`,
                            email: signUp.email,
                            clerkId: signUp.createdUserId
                        })
                    });
                }

                return {
                    sucess: true,
                    code: "success",
                    message: "You have successfully signed in with Google"
                }
            }
        }

        return {
            sucess: false,
            message: "An error occurred while signing in with Google"
        }
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            code: error.code,
            message: error?.errors[0]?.longMessage
        }
    }
}