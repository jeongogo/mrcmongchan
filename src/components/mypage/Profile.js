import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import useStore from '../../store/store';
import { updateUser } from '../../lib/user';
import { StyleSheet, Text, View, Pressable, Image, ActivityIndicator, TextInput } from 'react-native';
import CustomButton from "../common/CustomButton";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Profile() {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [name, setName] = useState(user.name);

  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      (res) => {
        if (res.didCancel) {
          return;
        }
        setResponse(res);
      },
    );
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      let photoURL = user.photoURL;
  
      if (response) {
        const asset = response.assets[0];
        const extension = asset.fileName.split('.').pop();
        const reference = storage().ref(`/profile/${user.uid}.${extension}`);
  
        if (Platform.OS === 'android') {
          await reference.putString(asset.base64, 'base64', {
            contentType: asset.type,
          });
        } else {
          await reference.putFile(asset.uri);
        }
  
        photoURL = response ? await reference.getDownloadURL() : null;
      }

      const data = {
        name,
        photoURL,
      }
  
      await updateUser(user.uid, data);
      setUser({...user, ...data});

      navigation.navigate('MypageHome');
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        <Pressable onPress={onSelectImage}>
          <Image
            style={styles.circle}
            source={
              response
              ? {uri: response?.assets[0]?.uri}
              : user.photoURL
                ? {uri: user.photoURL}
                : require('../../assets/images/user.png')
            }
          />
          <Icon style={styles.camera} name='camera' color='#666' size={24} />
        </Pressable>
      </View>
      <View style={styles.info}>
        <TextInput
          placeholder='이름'
          value={name}
          onChangeText={setName}
          onSubmitEditing={onSubmit}
          returnKeyType='next'
          style={styles.input}
        />
      </View>
      {loading
        ?
          <ActivityIndicator size={32} color='#ff4250' style={styles.spinner} />
        :
          <CustomButton title='저장' onPress={onSubmit} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 40,
    backgroundColor: '#fff',
  },
  photo: {
    display: 'flex',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#cdcdcd',
    borderRadius: 64,
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  camera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  info: {
    marginVertical: 32,
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    paddingHorizontal: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
})

export default Profile