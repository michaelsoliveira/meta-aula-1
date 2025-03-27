import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { icons, images } from '@/constants';
import { useSignUp } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, Image } from 'react-native';
import { ReactNativeModal } from 'react-native-modal'

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
          <InputField
            label='Email'
            placeholder='Entre com seu email...'
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({...form, email: value})}
          />
          <InputField
            label='Password'
            placeholder='Entre com sua senha'
            secureTextEntry={true}
            textContentType='password'
            icon={icons.lock}
            value={form.password}
            onChangeText={(value) => setForm({...form, password: value})}
          />
          <CustomButton
            title='Cadastrar'
            onPress={onSignUpPress}
            textVariant='primary'
            className='mt-6'
          />
          <Link
            href="/(auth)/sign-in"
            className='text-lg text-center text-gray-600 mt-10'
          >
            Já tem uma conta ?{" "}
            <Text className='text-blue-500'>Log In</Text>
          </Link>
        </View>
      </View>
      <ReactNativeModal
        isVisible={verification.state === "pending"}
        onModalHide={() => {
          if (verification.state === "success") {
            setShowSuccessModal(true)
          }
        }}
      >
        <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
          <Text className='text-2xl mb-2'>
            Verificação
          </Text>
          <Text className='mb-5'>Nós enviamos uma email de verificação para {form.email}</Text>
          <InputField 
            label={'Código'}
            icon={icons.lock}
            placeholder='12345'
            value={verification.code}
            keyboardType='numeric'
            onChangeText={(code) => {
              setVerification({ ...verification, code })
            }}
          />
          {verification.error && (
            <Text className='text-red-500 text-sm mt-1'>
              {verification.error}
            </Text>
          )}
          <CustomButton
            title='Verificar Email'
            onPress={onPressVerify}
            className='mt-5 bg-green-500'
          />
        </View>
      </ReactNativeModal>
    </ScrollView>
  );
}

export default SignUp;