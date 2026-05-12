export const Lobby = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Lobby</h1>
      <p>Welcome to the Ink Creature lobby!</p>
      <div style={{ marginTop: "20px" }}>
        <button style={{ 
          padding: "10px 20px", 
          marginRight: "10px",
          backgroundColor: "#aa3bff",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}>
          Create Room
        </button>
        <button style={{ 
          padding: "10px 20px",
          backgroundColor: "#6b6375",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}>
          Join Room
        </button>
      </div>
    </div>
  )
}