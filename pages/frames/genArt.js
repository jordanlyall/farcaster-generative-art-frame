import Head from "next/head";

const FrameTwo = () => {
  return (
    <Head>
      <meta property="fc:frame" content="vNext" />
      <meta
        property="fc:frame:image"
        content="https://www.host.com/genart.png"
      />
      <meta property="og:image" content="/genart.png" />
      <meta property="fc:frame:button:1" content="Generate" />
      <meta
        property="fc:frame:post_url"
        content="https://www.host.com/api/gen"
      />
      <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    </Head>
  );
};

export default FrameTwo;
