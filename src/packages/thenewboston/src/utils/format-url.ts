/**
 * Normalizes a url for requests to be made with.
 * @param url the url string that must include the protocol (https, http, ect.) of the requests
 */
export function formatUrl(url: string) {
  const { protocol, host } = new URL(url);
  const cors = "https://radiant-taiga-39526.herokuapp.com";
  return `${cors}/${protocol ?? "http"}//${host}`;
}
