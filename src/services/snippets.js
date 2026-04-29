import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

function getSnippetsRef() {
  if (!db) {
    throw new Error('Add your Firebase config to .env before using snippets.')
  }

  return collection(db, 'snippets')
}

function normalizeSnippet(input, userId) {
  return {
    title: input.title.trim(),
    language: input.language.trim().toLowerCase(),
    code: input.code,
    description: input.description.trim(),
    tags: input.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean),
    userId,
  }
}

export function subscribeToUserSnippets(userId, callback, onError) {
  const q = query(getSnippetsRef(), where('userId', '==', userId))

  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })),
      )
    },
    onError,
  )
}

export function createSnippet(input, userId) {
  return addDoc(getSnippetsRef(), {
    ...normalizeSnippet(input, userId),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateSnippet(snippetId, input, userId) {
  const snippetDoc = doc(db, 'snippets', snippetId)
  const snapshot = await getDoc(snippetDoc)

  if (!snapshot.exists() || snapshot.data().userId !== userId) {
    throw new Error('You do not have permission to edit this snippet.')
  }

  return updateDoc(snippetDoc, {
    ...normalizeSnippet(input, userId),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteSnippet(snippetId, userId) {
  const snippetDoc = doc(db, 'snippets', snippetId)
  const snapshot = await getDoc(snippetDoc)

  if (!snapshot.exists() || snapshot.data().userId !== userId) {
    throw new Error('You do not have permission to delete this snippet.')
  }

  return deleteDoc(snippetDoc)
}
