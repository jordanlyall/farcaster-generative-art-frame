function MyApp({ Component, pageProps }) {
  return (
    <html lang="en">
      <body>
        <Component {...pageProps} />
      </body>
    </html>
  );
}

export default MyApp;
