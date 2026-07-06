@echo off
cd /d "%~dp0Usuarios"
echo Iniciando Usuarios (8084)...
java -jar target\usuarios-service-0.0.1-SNAPSHOT.jar
pause
