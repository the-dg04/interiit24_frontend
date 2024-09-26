module.exports = {
    async headers() {
      return [
        {
          source: "/auth/login",
          headers: [
            {
              key: "Cross-Origin-Embedder-Policy",
              value: "same-origin-allow-popups",
            },
          ],
        },
      ];
    },
  };