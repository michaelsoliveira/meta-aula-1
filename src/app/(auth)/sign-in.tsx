import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { icons, images } from '@/constants';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, Alert, ScrollView, Image } from 'react-native';
export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;
    console.log(JSON.stringify(form, null, 2))
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Login falhou, por favor tente novamente");
      }
    } catch(error: any) {
      console.log(JSON.stringify(error, null, 2));
      Alert.alert("Error", error.errors[0].longMessage)
    }
  }, [isLoaded, signIn, form.email, form.password, setActive, router])

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className='text-exl text-black absolute bottom-5 left-5'>
            Welcome
          </Text>
        </View>

        <View className='p-5'>
          <InputField 
            label='Email'
            placeholder='Entre com email'
            icon={icons.email}
            textContentType='emailAddress'
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
          />

          <InputField 
            label='Senha'
            placeholder='Entre com email'
            icon={icons.lock}
            textContentType='password'
            value={form.password}
            onChangeText={(value: any) => setForm({ ...form, password: value })}
          />

          <CustomButton 
            title='Entrar'
            onPress={onSignInPress}
            className='mt-6'
          />

          <Link
            href="/(auth)/sign-up"
            className='text-lg text-center mt-10'
          >
            Não tem uma conta?{" "}
            <Text className='text-blue-500' >Cadastrar</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}