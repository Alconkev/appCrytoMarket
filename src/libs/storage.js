import AsyncStorage from "@react-native-async-storage/async-storage";

class Storage {

    static instance = new Storage();
    
    add = async (key, value) => {
      try {
        await AsyncStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.log('Storage Error', e);
        return false;
      }
    };
  
    get = async (key) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (e) {
        console.log('Storage get Error', e);
      }
    };
  
    remove = async (key) => {
      try {
        await AsyncStorage.removeItem(key);
        return true;
      } catch (e) {
        console.log('Storage remove Error', e);
        return false;
      }
    };
  
    multiGet = async (keys) => {
      try {
        return await AsyncStorage.multiGet(keys);
      } catch (e) {
        console.log('Storage  multiGet Error', e);
        throw Error(e);
      }
    };
  
    getAllKeys = async () => {
      try {
        return await AsyncStorage.getAllKeys();
      } catch (e) {
        console.log('Storage getAllKeys err', e);
        throw Error(e);
      }
    };

}

export default Storage;