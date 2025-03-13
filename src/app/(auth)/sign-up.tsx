import InputField from '@/components/InputField';
import { icons, images } from '@/constants';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { View, Text, Alert, ScrollView, Image } from 'react-native';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: ""
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending"
      });
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2))
      Alert.alert("Error", error.errors[0].longMessage);
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ 
        code: verification.code
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success"
        });
      } else {
        setVerification({
          ...verification,
          error: "Verificação falhou, Por favor tente novamente.",
          state: "failed"
        });
      }
    } catch (error: any) {
      setVerification({
          ...verification,
          error: error.errors[0].longMessage,
          state: "failed"
      });
    }
  }

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className='text-2xl text-black absolute bottom-5 left-5'>
            Create Your Account
          </Text>
        </View>
        <View className='p-5'>
          <InputField
            label='Nome'
            placeholder='Entre com seu nome...'
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({...form, name: value})}
          />
        </View>
        <View className='p-5'>
          <InputField
            label='Email'
            placeholder='Entre com seu email...'
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({...form, email: value})}
          />
        </View>
        <View className='p-5'>
          <InputField
            label='Password'
            placeholder='Entre com sua senha'
            secureTextEntry={true}
            textContentType='password'
            icon={icons.lock}
            value={form.password}
            onChangeText={(value) => setForm({...form, password: value})}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default SignUp;