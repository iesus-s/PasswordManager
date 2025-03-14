import { useColorScheme as useSystemColorScheme } from 'react-native';

const useColorScheme = () => {
  return useSystemColorScheme();
};

export default useColorScheme; // Default export
