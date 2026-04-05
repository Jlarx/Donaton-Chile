@echo off
echo Iniciando Proyecto Donaton (Microservicios y Frontend)...

echo Levantando Discovery Server Eureka (Puerto 8761)...
start "Eureka" cmd /k "cd EurekaServer && ..\..\mvnw spring-boot:run"
timeout /t 10 /nobreak > nul

echo Levantando módulo de Donaciones (Puerto 8081)...
start "Donaciones" cmd /k "cd Donaciones && ..\..\mvnw spring-boot:run"

echo Levantando módulo de Logistica (Puerto 8082)...
start "Logistica" cmd /k "cd Logistica && ..\..\mvnw spring-boot:run"

echo Levantando módulo Central/Gateway (Puerto 8080)...
start "Central" cmd /k "cd Central && ..\..\mvnw spring-boot:run"

echo Levantando módulo de Necesidades (Puerto 8083)...
start "Necesidades" cmd /k "cd Necesidades && ..\..\mvnw spring-boot:run"

echo Levantando Portal de usuario (Puerto 5173)...
start "Portal" cmd /k "cd Portal && npm run dev"

echo ¡Todos los servicios han sido lanzados en ventanas separadas!
echo Espere unos segundos a que inicialicen y luego abra http://localhost:5173 en su navegador.
pause
