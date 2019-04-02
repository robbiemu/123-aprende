/** helper method - generate a valid firebase payload for app metric data
 */
export function getAppTx (object) {
  object.date = getFirebaseDate()
  return object
}

/** helper method - generate a valid Date for firebse database
 * from src https://stackoverflow.com/questions/8362952/output-javascript-date-in-yyyy-mm-dd-hhmsec-format#answer-54187918
 */
const getFirebaseDate = (date = new Date()) =>
  date
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')
