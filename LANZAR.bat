@echo off
chcp 65001 > nul
cd /d "%~dp0"
title DONATON - Lanzador
cls
echo.
echo  =============================================
echo   DONATON - Iniciando Microservicios
echo  =============================================
echo.
echo  [ATENCION] Asegurese de tener PostgreSQL en ejecucion (puerto 5432)
echo             y con las bases de datos creadas. Si no lo tiene, use:
echo             docker-compose up postgres -d
echo  =============================================
echo.
echo [0] Eureka Server (8761)
start "Eureka:8761" _run_eureka.bat
echo Esperando 12s para inicializar Eureka...
timeout /t 12 /nobreak > nul

echo [1] Usuarios (8084)
start "Usuarios:8084" _run_usuarios.bat
timeout /t 5 /nobreak > nul

echo [2] Donaciones (8081)
start "Donaciones:8081" _run_donaciones.bat

echo [3] Logistica (8082)
start "Logistica:8082" _run_logistica.bat

echo [4] Necesidades (8083)
start "Necesidades:8083" _run_necesidades.bat

echo.
echo  Esperando 30s para registro en Eureka...
timeout /t 30 /nobreak > nul

echo [5] Gateway Central (8080)
start "Gateway:8080" _run_gateway.bat

echo.
echo  =============================================
echo   Espera 30s mas y abre: http://localhost:5173
echo   Admin: admin@donaton.cl / admin123
echo  =============================================
pause
