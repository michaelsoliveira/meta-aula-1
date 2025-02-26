import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const ExplorePage = () => {
  return (
    <SafeAreaView>
      <View className="flex-1 justify-center items-center bg-blue-500">
        <Text className='text-2xl text-white'>Página 2</Text>
      </View>
    </SafeAreaView>
  );
}

export default ExplorePage