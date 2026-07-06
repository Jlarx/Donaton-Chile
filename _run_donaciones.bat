@echo off
cd /d "%~dp0Donaciones"
echo Iniciando Donaciones (8081)...
java -jar target\donaciones-service-0.0.1-SNAPSHOT.jar
pause
