import firestore from '@react-native-firebase/firestore';

export const usersCollection = firestore().collection('Users');

export function createUser(userData) {
    return usersCollection.doc(userData.uid).set(userData);
}

export async function getUser(id) {
    const doc = await usersCollection.doc(id).get();
    return doc.data();
}