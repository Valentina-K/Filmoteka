import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { app } from './auth';

const db = getFirestore(app);
const movieCollections = collection(db, 'movies');

const addMovie = async movie => {
  try {
    const docRef = await addDoc(movieCollections, movie);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const deleteMovie = async id => {
  try {
    const q = query(movieCollections, where('id', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};

const getQueueMovies = async uid => {
  const q = query(
    movieCollections,
    where('isQueue', '==', true),
    where('owner', '==', uid)
  );
  const querySnapshot = await getDocs(q);
  const respArr = [];
  querySnapshot.forEach(doc => {
    respArr.push(doc.data());
    // doc.data() is never undefined for query doc snapshots
  });
  return respArr;
};

const getWatchMovies = async uid => {
  const q = query(
    movieCollections,
    where('isWatch', '==', true),
    where('owner', '==', uid)
  );
  const querySnapshot = await getDocs(q);
  const respArr = [];
  querySnapshot.forEach(doc => {
    respArr.push(doc.data());
    // doc.data() is never undefined for query doc snapshots
  });
  return respArr;
};

export { addMovie, getWatchMovies, getQueueMovies, deleteMovie, snapshot };
