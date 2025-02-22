async function getAccessToken() {
  const token = localStorage.getItem(
    "oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable",
  );

  return JSON.parse(token).access_token;
}

getAccessToken()
  .then((token) =>
    fetch("https://api.mangaaz.org/manga/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  )
  .then((res) => res.json())
  .then((data) => {
    const ids = Object.keys(data.statuses);
    const source = "mangadex";
    return process(source, ids);
  });
