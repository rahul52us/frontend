"use client"; // Only needed if using Next.js App Router
const InstagramEmbedIframe = () => {
  return (
    <div className="instagram-container">
      <iframe
        src="https://www.instagram.com/reel/DE-gXrkyu83/embed"
        width="400"
        height="480"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        style={{
          border: "0",
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "540px",
          minWidth: "326px",
          width: "100%"
        }}
      ></iframe>
    </div>
  );
};

export default InstagramEmbedIframe;
