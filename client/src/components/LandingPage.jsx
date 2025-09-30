import { useEffect, useState } from "react";

const LandingPage = () => {
  const [showFullName, setShowFullName] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
       setShowFullName(true);
    }, 2000); // 2 seconds before showing full name
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f6fa"
    }}>
      <h1>Hey</h1>
      <h1 style={{
        fontSize: showFullName ? "2.5rem" : "4rem",
        transition: "font-size 0.5s"
      }}>
        ARPA
      </h1>
      {showFullName && (
        <h2 style={{
          marginTop: "1rem",
          fontWeight: "400",
          color: "#555",
          transition: "opacity 1s",
          opacity: showFullName ? 1 : 0
        }}>
          Algorithmic Resource and Problem Solving Assistant
        </h2>
      )}
    </div>
  );
};

export default LandingPage;