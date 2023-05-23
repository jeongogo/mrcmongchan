import React from 'react';
import {View, Text, StyleSheet, Pressable, Platform} from 'react-native';

function Popup({navigation, requestBackgroundPermission}) {
  return (
    <View style={styles.permission}>
      <View style={styles.permissionWrap}>
        <Text style={styles.permissionTitle}>권한 안내</Text>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionContentText}>
            - 모두의 러닝 코치 앱은 앱이 종료되었거나 사용 중이 아닐 때도 위치 데이터를 수집하여 러닝 추적 기능을 지원합니다.
          </Text>
          {(Platform.OS === 'android') && 
            <Text style={styles.permissionContentText}>
              - 상세한 러닝 트래킹 정보를 추적하기 위해 백그라운드 모드 권한, 신체활동 정보 권한이 필요합니다.
            </Text>
          }
        </View>
        <View style={styles.permissionBtns}>
          <Pressable style={styles.permissionBtnCancel} onPress={() => navigation.navigate('HomeStack')}>
            <Text style={styles.permissionBtnTextCancel}>취소</Text>
          </Pressable>
          <Pressable style={styles.permissionBtn} onPress={requestBackgroundPermission}>
            <Text style={styles.permissionBtnText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  permission: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    paddingHorizontal: 50,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 12,
  },
  permissionWrap: {
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  permissionTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 22,
    fontWeight: 500,
    color: '#222',
    textAlign: 'center',
  },
  permissionContent: {
    paddingVertical: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#222',
  },
  permissionContentText: {
    paddingVertical: 5,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#454545',
  },
  permissionBtns: {
    marginTop: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  permissionBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexGrow: 1,
    backgroundColor: '#E53A40',
    borderRadius: 5,
  },
  permissionBtnCancel: {
    marginRight: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#E53A40',
    borderRadius: 5,
  },
  permissionBtnText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    color: '#fff',
  },
  permissionBtnTextCancel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    color: '#E53A40',
  },
});

export default Popup