/**
 * Normalizes a url for requests to be made with.
 * @param url the url string that must include the protocol (https, http, ect.) of the requests
 */
export function formatUrl(url: string) {
  const { protocol, host } = new URL(url);
  const cors = "https://infinite-atoll-88697.herokuapp.com";

  if (process.env.VERCEL_ENV === "production") {
    `${cors}/${protocol ?? "http"}//${host}`;
  }
  return `${protocol ?? "http"}//${host}`;
}
