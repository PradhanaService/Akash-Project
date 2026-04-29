export function getFriendlyFirebaseError(error) {
  if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
    return 'Firestore permissions are blocking this request. In Firebase Console, create a Firestore database and publish the rules from firestore.rules so each signed-in user can read and write only their own snippets.'
  }

  if (error?.code === 'failed-precondition' && error?.message?.includes('index')) {
    return 'Firestore needs an index for this query. Open the index link in the browser console or Firebase Console, create the suggested index, then refresh.'
  }

  return error?.message || 'Something went wrong. Please try again.'
}
