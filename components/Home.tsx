import React from "react";

const Home: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100vh",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      <section>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
          Welcome to invently.ai, an AI based inventory manager to manage all
          your inventory needs.
        </h1>
      </section>
      <section></section>
    </div>
  );
};

export default Home;
