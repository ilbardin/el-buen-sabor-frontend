export default function LoginUsuario() {
  return (
    <div>
      <form style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Iniciar Sesion</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Email:</label><br />
        <input
          type="email"
          //value={email}
          //onChange={(e) => setEmail(e.target.//value)}
          required
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Contraseña:</label><br />
        <input
          type="password"
          //value={password}
          //onChange={(e) => setPassword(e.target.//value)}
          required
          style={{ width: "100%" }}
        />
      </div>


      <button type="submit">Iniciar sesión</button>
    </form>
    </div>
  );
}
