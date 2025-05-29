export function RegisterUsuario() {
  return (
    <div>
      <form style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Registro</h2>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="nombre">Nombre:</label><br />
        <input id="nombre" name="nombre" type="text" required style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="apellido">Apellido:</label><br />
        <input id="apellido" name="apellido" type="text" required style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="email">Correo electrónico:</label><br />
        <input id="email" name="email" type="email" required style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="password">Contraseña:</label><br />
        <input id="password" name="password" type="password" required style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="confirmPassword">Confirmar Contraseña:</label><br />
        <input id="confirmPassword" name="confirmPassword" type="password" required style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="departamento">Departamento:</label><br />
        <input id="departamento" name="departamento" type="text" required style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="direccion">Dirección:</label><br />
        <input id="direccion" name="direccion" type="text" required style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="telefono">Teléfono:</label><br />
        <input id="telefono" name="telefono" type="tel" required style={{ width: "100%" }} />
      </div>

      <button type="submit" style={{ width: "100%" }}>Confirmar registro</button>

      <p style={{ marginTop: 10 }}>
        <a href="/loginUsuario">Ya tengo una cuenta</a>
      </p>
    </form>
    </div>
  );
}