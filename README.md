# Proyecto El Buen Sabor - Frontend

Este proyecto utiliza React, Vite y TypeScript como base de desarrollo. A continuación, se detallan los pasos necesarios
para levantar el proyecto correctamente.

## Requisitos

1. Tener instalado **Node.js 22** o superior.
2. Generar un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:
    - `VITE_API_URL` (URL de la API, por completar por el usuario)
    - `VITE_MERCADOPAGO_KEY` (Clave de MercadoPago, por completar por el usuario)
3. Para ejecutar el proyecto utilizando **HTTPS**, se necesitan dos archivos `.pem` generados mediante **mkcert**:
    - `localhost.pem`
    - `localhost-key.pem`

---

## Instrucciones para configurar y levantar el proyecto

### 1. Crear el archivo `.env`

En la raíz del proyecto, crea un archivo `.env` y agrega lo siguiente para configurarlo:

```env
VITE_API_URL=http://localhost:8080/api  # (o la URL donde corra el backend)
VITE_MERCADOPAGO_KEY=MI_CLAVE_PUBLICA_MERCADOPAGO
```

Rellena los valores según corresponda.

---

### 2. Generar certificados `.pem` con mkcert

Sigue los pasos a continuación para crear los certificados necesarios:

#### a. Instalar Chocolatey

Si no tienes Chocolatey instalado, abre **PowerShell como _administrador_** y ejecuta el siguiente comando:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

#### b. Instalar mkcert

Cierra y vuelve a abrir **PowerShell** como administrador y ejecuta:

```powershell
choco install mkcert -y
```

#### c. Configurar mkcert

Una vez instalado, ejecuta el siguiente comando para instalar el certificado raíz:

```powershell
mkcert -install
```

#### d. Generar certificados para localhost

Navega hasta la raíz del proyecto y ejecuta:

```powershell
mkcert localhost 127.0.0.1 ::1
```

Esto generará dos archivos:

- `localhost.pem`
- `localhost-key.pem`

Si los archivos generados tienen nombres diferentes, renómbralos a `localhost.pem` y `localhost-key.pem`.

---

### 3. Ejecutar el proyecto

Con todos los pasos anteriores completados correctamente, levanta el proyecto ejecutando:

```bash
npm run dev
```

El proyecto estará disponible en:  
**https://localhost:5173**

---

## Notas importantes

- Asegúrate de completar las variables de entorno en el archivo `.env` antes de ejecutar el proyecto.
- Si encuentras problemas con los certificados o la instalación de mkcert, revisa las instrucciones cuidadosamente o
  consulta la documentación oficial de mkcert.


